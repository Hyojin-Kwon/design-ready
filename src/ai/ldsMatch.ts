import {
  BUILTIN_LDS,
  getFigmaComponentKey,
  getFigmaComponentName,
  type LdsFigmaComponentEntry
} from "../data/ldsComponents";

export interface LdsMatch {
  match: string;
  key: string | null;
  score: number;
  source: "components" | "figmaComponents";
}

const STOPWORDS = new Set(["x", "the", "and", "or", "of", "a", "an"]);

const PLATFORM_TOKENS = new Set(["ios", "android", "web", "desktop"]);
const THEME_TOKENS = new Set(["light", "dark", "overlay", "common"]);

function tokenize(name: string): Set<string> {
  const tokens = name
    .toLowerCase()
    .replace(/[◻️◼️]/g, " ")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t) && !/^\d+$/.test(t));
  return new Set(tokens);
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

function scorePair(queryTokens: Set<string>, candidate: string): number {
  const candTokens = tokenize(candidate);
  if (candTokens.size === 0 || queryTokens.size === 0) return 0;
  let intersection = 0;
  for (const t of queryTokens) {
    if (candTokens.has(t)) intersection += 1;
  }
  const union = candTokens.size + queryTokens.size - intersection;
  let score = intersection / union;

  if (exclusiveDisagreement(queryTokens, candTokens, PLATFORM_TOKENS)) score -= 0.4;
  if (exclusiveDisagreement(queryTokens, candTokens, THEME_TOKENS)) score -= 0.2;

  return score;
}

export function findLdsMatch(
  nodeName: string,
  options: { minScore?: number } = {}
): LdsMatch | null {
  const minScore = options.minScore ?? 0.35;
  const queryTokens = tokenize(nodeName);
  if (queryTokens.size === 0) return null;

  const queryPrefix = keepNumericPrefix(nodeName);
  let best: LdsMatch | null = null;

  const figmaPool: LdsFigmaComponentEntry[] = BUILTIN_LDS.figmaComponents ?? [];

  for (const candidate of BUILTIN_LDS.components) {
    let score = scorePair(queryTokens, candidate);
    if (queryPrefix && keepNumericPrefix(candidate) === queryPrefix) score += 0.1;
    if (!best || score > best.score) {
      best = { match: candidate, key: null, score, source: "components" };
    }
  }

  for (const entry of figmaPool) {
    const name = getFigmaComponentName(entry);
    let score = scorePair(queryTokens, name);
    if (queryPrefix && keepNumericPrefix(name) === queryPrefix) score += 0.1;
    if (!best || score > best.score) {
      best = {
        match: name,
        key: getFigmaComponentKey(entry),
        score,
        source: "figmaComponents"
      };
    }
  }

  if (!best || best.score < minScore) return null;
  return best;
}
