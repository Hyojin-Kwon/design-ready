import {
  BUILTIN_LDS,
  getFigmaComponentKey,
  getFigmaComponentName,
  type LdsFigmaComponentEntry
} from "../data/ldsComponents";

// 런타임에 주입되는 추가 풀. LDS 템플릿 파일에서 추출한 catalog가 들어감.
// BUILTIN_LDS.figmaComponents는 빌드 타임 정적 어휘, 이건 사용자가 런타임에 확장한 어휘.
let EXTRA_FIGMA_POOL: Array<{ name: string; key: string }> = [];

export function setExtraFigmaPool(pool: Array<{ name: string; key: string }>): void {
  EXTRA_FIGMA_POOL = pool;
}

export function getExtraFigmaPoolSize(): number {
  return EXTRA_FIGMA_POOL.length;
}

export interface LdsMatch {
  match: string;
  key: string | null;
  score: number;
  // 대칭 유사도. 교체 신뢰도 판단은 이 값 기준(짧은 쿼리가 긴 후보에 우연히 포함되는 오탐 방지).
  jaccard: number;
  source: "components" | "figmaComponents";
}

const STOPWORDS = new Set([
  "x",
  "the",
  "and",
  "or",
  "of",
  "a",
  "an",
  // Figma variant property 이름은 보통 값이 중요하지 이름 자체는 메타임.
  // "Type", "Mode", "State", "Size" 등은 RHS(값)만 남기고 제거해도 매칭에 도움.
  "type",
  "mode",
  "state",
  "variant",
  "style"
  // 주의: "off", "on", "default", "common", "none"은 STOPWORDS가 아님.
  // LDS 네이밍에서 이들은 실제 variant 값이라 형제 컴포넌트(예: Notification - OFF vs OFF2)를
  // 구분하는 핵심 신호. 드롭하면 terminal 비교에서 둘이 같아 보여 오탐 발생.
]);

// "Property=Value" 또는 "Property = Value" 형태에서 Property 이름 제거.
// Figma에서 variant 붙은 인스턴스를 떼면 이런 형태로 이름이 박힌다.
function stripVariantPropertyNames(name: string): string {
  return name.replace(/[A-Za-z][\w\s]*\s*=\s*/g, " ");
}

// 합성 컨테이너 패턴: 하위에 여러 LDS 컴포넌트를 조합하는 상위 래퍼.
// 이름만으로 1:1 교체 대상이 아닌 명확한 케이스만 남긴다.
// (Flex Message, Chatroom 등은 하위 variant 매칭 대상이므로 여기서 제외)
const COMPOSITE_PATTERNS = [
  /\btemplate\b/i,
  /\bscreen\b/i,
  /\bsection\b/i
];

export function isCompositeContainer(name: string): boolean {
  return COMPOSITE_PATTERNS.some((p) => p.test(name));
}

const PLATFORM_TOKENS = new Set(["ios", "android", "web", "desktop"]);
const THEME_TOKENS = new Set(["light", "dark", "overlay", "common"]);

// "단어 + 숫자" 인접 쌍은 합성 토큰으로 유지해서 사이즈/레벨 suffix가 매칭에 반영되도록 함.
// 예: "Title 1" → "title1", "Size 12" → "size12". 단독 숫자는 의미 없으니 계속 드랍.
// (LDS 네이밍에서 "Title 1 + Body 2", "Size 12" 등은 사이즈/레벨을 가르는 핵심 신호.)
function filterAndMergeTokens(raw: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const cur = raw[i];
    const nxt = raw[i + 1];
    if (/^[a-z]+$/.test(cur) && nxt && /^\d+$/.test(nxt)) {
      if (cur.length >= 2 && !STOPWORDS.has(cur)) out.push(`${cur}${nxt}`);
      i += 1;
      continue;
    }
    if (/^\d+$/.test(cur)) continue;
    if (cur.length < 2) continue;
    if (STOPWORDS.has(cur)) continue;
    out.push(cur);
  }
  return out;
}

export function tokenListOrdered(name: string): string[] {
  const normalized = stripVariantPropertyNames(name);
  const raw = normalized
    .toLowerCase()
    .replace(/[◻️◼️]/g, " ")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  return filterAndMergeTokens(raw);
}

// 경로에서 마지막 세그먼트(실제 컴포넌트명)의 토큰만. 경로가 없으면 전체 반환.
// 형제 컴포넌트들은 prefix가 같아서 bag-of-words 점수가 비슷해지는 문제를 보정하기 위함.
function terminalTokens(name: string): Set<string> {
  const normalized = stripVariantPropertyNames(name);
  const segments = normalized.split("/").map((s) => s.trim()).filter(Boolean);
  const last = segments.length > 0 ? segments[segments.length - 1] : normalized;
  const raw = last
    .toLowerCase()
    .replace(/[◻️◼️]/g, " ")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  return new Set(filterAndMergeTokens(raw));
}

function tokenize(name: string): Set<string> {
  return new Set(tokenListOrdered(name));
}

// 연속한 2-단어 구(句)를 추출. 예: "image grid message" → ["image grid","grid message"]
function bigrams(tokens: string[]): Set<string> {
  const out = new Set<string>();
  for (let i = 0; i < tokens.length - 1; i++) {
    out.add(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return out;
}

function keepNumericPrefix(name: string): string | null {
  const match = name.match(/^(\d{3})\s+/);
  return match ? match[1] : null;
}

function exclusiveDisagreement(
  a: Set<string>,
  b: Set<string>,
  group: Set<string>
): boolean {
  const aHas = [...group].filter((t) => a.has(t));
  const bHas = [...group].filter((t) => b.has(t));
  if (aHas.length === 0 || bHas.length === 0) return false;
  return !aHas.some((t) => bHas.includes(t));
}

interface ScoreResult {
  score: number;
  jaccard: number;
}

function scorePair(
  queryTokens: Set<string>,
  queryBigrams: Set<string>,
  queryTerminal: Set<string>,
  candidate: string
): ScoreResult {
  const candList = tokenListOrdered(candidate);
  const candTokens = new Set(candList);
  if (candTokens.size === 0 || queryTokens.size === 0) return { score: 0, jaccard: 0 };
  let intersection = 0;
  for (const t of queryTokens) {
    if (candTokens.has(t)) intersection += 1;
  }
  const union = candTokens.size + queryTokens.size - intersection;
  const jaccard = intersection / union;
  // queryRecall: 쿼리 토큰이 후보에 얼마나 포함되는지 (비대칭).
  // LDS 이름은 플랫폼/테마/사이즈 같은 변형 접미사가 더 붙어 길어지는 경향이 있어
  // 대칭 Jaccard 는 정당한 서브셋 매칭을 과도하게 깎는다.
  const queryRecall = intersection / queryTokens.size;
  let score = Math.max(jaccard, queryRecall * 0.95);

  // 마지막 세그먼트(실제 컴포넌트명) 일치 분석.
  // 경로 prefix만 같고 실제 variant가 다른 형제 컴포넌트 오탐을 막는 핵심 로직.
  // 예: "... / Notification - OFF2" vs "... / Notification - OFF" — path는 거의 같지만
  // 실제 variant는 다른 컴포넌트.
  // 3가지 케이스로 분기:
  //   - no overlap: 완전 다른 컴포넌트 (큰 페널티, bigram 보너스 무력화)
  //   - 양쪽 모두 unique 토큰 보유: variant divergence (큰 페널티, bigram 스케일 다운)
  //   - 한쪽이 다른 쪽의 부분집합: 정당한 매칭 (보너스 작게, bigram 그대로)
  let terminalAgreement = 1; // 1=정당 매칭, 0.25=variant divergence, 0=완전 다름
  let termPenalty = 0;
  let termBonus = 0;
  if (queryTerminal.size > 0) {
    const candTerminal = terminalTokens(candidate);
    if (candTerminal.size > 0) {
      let termOverlap = 0;
      for (const t of queryTerminal) if (candTerminal.has(t)) termOverlap += 1;
      if (termOverlap === 0) {
        terminalAgreement = 0;
        termPenalty = 0.5;
      } else {
        const queryUnique = queryTerminal.size - termOverlap;
        const candUnique = candTerminal.size - termOverlap;
        if (queryUnique > 0 && candUnique > 0) {
          // 양쪽에 고유 토큰 → 같은 path여도 다른 variant.
          // 예: {title, body3} vs {title, bold} — title 겹쳐도 body3 vs bold가 핵심 차이.
          terminalAgreement = 0.25;
          termPenalty = 0.45;
        } else {
          // 부분집합 (한쪽이 다른쪽 포함) — 정당한 매칭.
          const termRecall = termOverlap / queryTerminal.size;
          termBonus = Math.min(0.15, termRecall * 0.15);
        }
      }
    }
  }

  // 2-단어 구(句) 매칭 보너스. "image grid", "message bubble" 같은 명사구가
  // 양쪽에 동시 등장하면 강한 신호. 단, terminal divergence 케이스에선 path 유사성이
  // 같은 variant를 의미하지 않으므로 보너스를 스케일 다운.
  if (queryBigrams.size > 0) {
    const candBigrams = bigrams(candList);
    let shared = 0;
    for (const b of queryBigrams) if (candBigrams.has(b)) shared += 1;
    if (shared > 0) {
      score += Math.min(0.4, shared * 0.25) * terminalAgreement;
    }
  }

  if (exclusiveDisagreement(queryTokens, candTokens, PLATFORM_TOKENS)) score -= 0.6;
  if (exclusiveDisagreement(queryTokens, candTokens, THEME_TOKENS)) score -= 0.35;

  score += termBonus;
  score -= termPenalty;

  // 내부 점수는 clamp하지 않음 — 후보 간 비교 시 bonus 적층이 clamp에 가려져
  // 테마/플랫폼 페널티가 동점에 묻히는 버그를 피한다. 최종 반환 시에만 clamp.
  if (score < 0) score = 0;
  return { score, jaccard };
}

// 100% exact match (대소문자/주변 공백 무시)만 반환. 시스템 카테고리(디태치 LDS 후보) 전용.
// fuzzy 매처는 형제 컴포넌트 오탐 위험이 있어 디태치 교체같은 파괴적 액션엔 부적합.
export function findExactLdsMatch(nodeName: string): LdsMatch | null {
  const norm = (s: string) => s.trim().toLowerCase();
  const target = norm(nodeName);
  if (!target) return null;

  for (const candidate of BUILTIN_LDS.components) {
    if (norm(candidate) === target) {
      return { match: candidate, key: null, score: 1, jaccard: 1, source: "components" };
    }
  }
  for (const entry of EXTRA_FIGMA_POOL) {
    const name = entry.name;
    if (norm(name) === target) {
      return { match: name, key: entry.key ?? null, score: 1, jaccard: 1, source: "figmaComponents" };
    }
  }
  for (const entry of BUILTIN_LDS.figmaComponents ?? []) {
    const name = getFigmaComponentName(entry);
    const key = getFigmaComponentKey(entry);
    if (norm(name) === target) {
      return { match: name, key, score: 1, jaccard: 1, source: "figmaComponents" };
    }
  }
  return null;
}

export function findLdsMatch(
  nodeName: string,
  options: { minScore?: number } = {}
): LdsMatch | null {
  const minScore = options.minScore ?? 0.5;
  // 합성 컨테이너는 1:1 교체 대상이 아님 — 자식이 개별 매칭되도록 상위는 스킵.
  if (isCompositeContainer(nodeName)) return null;
  const queryList = tokenListOrdered(nodeName);
  const queryTokens = new Set(queryList);
  if (queryTokens.size === 0) return null;
  const queryBigrams = bigrams(queryList);
  const queryTerminal = terminalTokens(nodeName);

  const queryPrefix = keepNumericPrefix(nodeName);
  let best: LdsMatch | null = null;

  // 정적 figmaComponents + 런타임 주입 EXTRA 풀 병합. key 기준 dedupe (EXTRA 우선 — 최신).
  const figmaPool: LdsFigmaComponentEntry[] = (() => {
    const byKey = new Map<string, LdsFigmaComponentEntry>();
    const byName = new Map<string, LdsFigmaComponentEntry>();
    const add = (entry: LdsFigmaComponentEntry) => {
      const key = getFigmaComponentKey(entry);
      const name = getFigmaComponentName(entry);
      if (key && byKey.has(key)) return;
      if (byName.has(name) && !key) return;
      if (key) byKey.set(key, entry);
      byName.set(name, entry);
    };
    for (const e of EXTRA_FIGMA_POOL) add(e);
    for (const e of BUILTIN_LDS.figmaComponents ?? []) add(e);
    return Array.from(byName.values());
  })();

  for (const candidate of BUILTIN_LDS.components) {
    const { score: raw, jaccard } = scorePair(queryTokens, queryBigrams, queryTerminal, candidate);
    let score = raw;
    if (queryPrefix && keepNumericPrefix(candidate) === queryPrefix) score += 0.1;
    // 내부 비교용 score는 clamp하지 않음 — bonus 적층 차이로 정당하게 순위가 갈려야 함.
    if (!best || score > best.score) {
      best = { match: candidate, key: null, score, jaccard, source: "components" };
    }
  }

  for (const entry of figmaPool) {
    const name = getFigmaComponentName(entry);
    const { score: raw, jaccard } = scorePair(queryTokens, queryBigrams, queryTerminal, name);
    let score = raw;
    if (queryPrefix && keepNumericPrefix(name) === queryPrefix) score += 0.1;
    if (!best || score > best.score) {
      best = {
        match: name,
        key: getFigmaComponentKey(entry),
        score,
        jaccard,
        source: "figmaComponents"
      };
    }
  }

  if (!best || best.score < minScore) return null;
  // UI 표시용으로만 최종 clamp.
  if (best.score > 1) best.score = 1;
  return best;
}
