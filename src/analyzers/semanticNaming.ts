import type { NamingSuggestion } from "../types";
import { findLdsMatch, tokenListOrdered } from "../ai/ldsMatch";
import {
  hasComponentNamedAncestor,
  isDefaultName,
  looksLikeComponentNaming
} from "../rules/namingRules";
import {
  approxEqual,
  isComponentInternal,
  isInsideHidden,
  isSameSizeAsParent,
  walk
} from "../utils/nodeTraversal";

interface Suggestion {
  name: string;
  reason: string;
}

function findFirstVisibleText(node: SceneNode, depth = 0): string | null {
  if (depth > 5) return null;
  if (node.type === "TEXT" && node.visible !== false) {
    const chars = (node as TextNode).characters;
    if (typeof chars === "string") {
      const trimmed = chars.trim();
      if (trimmed.length > 0 && trimmed.length <= 24) return trimmed;
    }
  }
  if ("children" in node) {
    const children = (node as ChildrenMixin).children as readonly SceneNode[];
    for (const child of children) {
      if (child.visible === false) continue;
      const t = findFirstVisibleText(child, depth + 1);
      if (t) return t;
    }
  }
  return null;
}

async function suggestFromInstance(node: SceneNode): Promise<Suggestion | null> {
  if (node.type !== "INSTANCE") return null;
  const instance = node as InstanceNode;
  // documentAccess: "dynamic-page" 모드에서는 동기 getter 대신 async 필수.
  const main = await instance.getMainComponentAsync();
  if (!main) return null;
  const text = findFirstVisibleText(node);
  if (text) {
    return {
      name: `${main.name} / ${text}`,
      reason: `메인 컴포넌트 "${main.name}" + 텍스트 "${text}"`
    };
  }
  return {
    name: main.name,
    reason: `메인 컴포넌트 "${main.name}"과 일치`
  };
}

function suggestBackground(node: SceneNode): Suggestion | null {
  if (node.type !== "RECTANGLE") return null;
  if (!isSameSizeAsParent(node)) return null;
  return { name: "Background", reason: "부모와 크기가 같은 Rectangle" };
}

function getPageFrame(node: SceneNode): SceneNode | null {
  let current: BaseNode | null = node.parent;
  while (current) {
    if (current.type === "FRAME" && current.parent && current.parent.type === "PAGE") {
      return current as SceneNode;
    }
    current = current.parent;
  }
  return null;
}

function suggestHeader(node: SceneNode): Suggestion | null {
  if (node.type !== "FRAME") return null;
  if (!("width" in node) || !("height" in node) || !("y" in node)) return null;
  const pageFrame = getPageFrame(node);
  if (!pageFrame || !("width" in pageFrame)) return null;
  if (!approxEqual(node.width, pageFrame.width, 2)) return null;
  if (node.y > 4) return null;
  if (node.height < 44 || node.height > 56) return null;
  return { name: "Header", reason: "최상단 + 풀와이드 + 헤더 높이" };
}

function suggestBottomNavigation(node: SceneNode): Suggestion | null {
  if (node.type !== "FRAME") return null;
  if (!("width" in node) || !("height" in node) || !("y" in node)) return null;
  const pageFrame = getPageFrame(node);
  if (!pageFrame || !("width" in pageFrame) || !("height" in pageFrame)) return null;
  if (!approxEqual(node.width, pageFrame.width, 2)) return null;
  const distanceFromBottom = pageFrame.height - (node.y + node.height);
  if (distanceFromBottom > 4) return null;
  if (node.height < 49 || node.height > 83) return null;
  return { name: "BottomNavigation", reason: "최하단 + 풀와이드 바" };
}

function suggestFromTextContent(node: SceneNode): Suggestion | null {
  if (node.type !== "TEXT") return null;
  const chars = (node as TextNode).characters;
  if (typeof chars !== "string") return null;
  const t = chars.trim();
  if (!t) return null;

  if (/^\d{1,2}:\d{2}(\s*(AM|PM))?$/i.test(t)) return { name: "Timestamp", reason: "시간 표기" };
  if (/^\d+\s*(min|mins|hr|hrs|h|d|day|days)\s*ago$/i.test(t))
    return { name: "RelativeTime", reason: "상대 시간" };
  if (/^\d+%$/.test(t)) return { name: "Percentage", reason: "퍼센트" };
  if (/^[¥$€£₩]\s*[\d,]+(\.\d+)?$/.test(t) || /^[\d,]+(\.\d+)?\s*(원|달러|엔|USD|KRW|JPY)$/i.test(t))
    return { name: "Price", reason: "가격 표기" };
  if (/^\+?\d{1,4}$/.test(t)) return { name: "Counter", reason: "숫자 카운터" };
  if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(t)) return { name: "Email", reason: "이메일" };
  if (/^https?:\/\//i.test(t)) return { name: "Url", reason: "URL" };
  if (/^[+]?[\d\s()-]{7,20}$/.test(t) && /\d{3,}/.test(t) && !/^[\d,]+$/.test(t))
    return { name: "PhoneNumber", reason: "전화번호" };
  if (/^[^A-Za-z0-9]?\d+(\.\d+)?[^A-Za-z0-9]?$/.test(t) && t.length <= 4)
    return null;

  return null;
}

async function suggestFromAutoLayout(node: SceneNode): Promise<Suggestion | null> {
  if (node.type !== "FRAME") return null;
  const frame = node as FrameNode;
  if (frame.layoutMode === "NONE") return null;
  if (frame.children.length < 2) return null;

  const kids = frame.children;
  const types = new Set(kids.map((c) => c.type));
  const uniformType = types.size === 1;

  if (uniformType && kids[0].type === "INSTANCE") {
    const names = new Set<string>();
    for (const c of kids) {
      const main = await (c as InstanceNode).getMainComponentAsync();
      if (main) names.add(main.name);
    }
    if (names.size === 1) {
      if (frame.layoutMode === "HORIZONTAL") {
        return {
          name: kids.length >= 3 ? "TabBar" : "ButtonGroup",
          reason: `horizontal 오토레이아웃 + 동일 인스턴스 ${kids.length}개`
        };
      }
      return { name: "ButtonList", reason: `vertical 오토레이아웃 + 동일 인스턴스 ${kids.length}개` };
    }
  }

  if (uniformType) {
    if (frame.layoutMode === "HORIZONTAL")
      return { name: "Row", reason: `horizontal 오토레이아웃 + 동일 타입 자식 ${kids.length}개` };
    return { name: "List", reason: `vertical 오토레이아웃 + 동일 타입 자식 ${kids.length}개` };
  }

  if (frame.layoutMode === "HORIZONTAL" && kids.length <= 4)
    return { name: "Row", reason: "horizontal 오토레이아웃" };
  if (frame.layoutMode === "VERTICAL" && kids.length >= 3)
    return { name: "Stack", reason: "vertical 오토레이아웃" };

  return null;
}

function suggestAvatar(node: SceneNode): Suggestion | null {
  if (!("width" in node) || !("height" in node)) return null;
  if (node.width !== node.height) return null;
  if (node.width < 20 || node.width > 96) return null;

  let isRound = false;
  if (node.type === "ELLIPSE") {
    isRound = true;
  } else if ("cornerRadius" in node) {
    const r = (node as CornerMixin).cornerRadius;
    if (typeof r === "number" && r >= node.width / 2 - 1) isRound = true;
  }
  if (!isRound) return null;

  if (!("fills" in node)) return null;
  const fills = (node as GeometryMixin).fills;
  if (fills === figma.mixed || !Array.isArray(fills)) return null;
  if (!fills.some((f) => f.visible !== false && f.type === "IMAGE")) return null;

  return { name: "Avatar", reason: "원형 + 이미지 fill" };
}

function suggestBadge(node: SceneNode): Suggestion | null {
  if (!("width" in node) || !("height" in node)) return null;
  if (node.width > 48 || node.height > 28) return null;
  if (!("children" in node)) return null;
  const kids = (node as ChildrenMixin).children as readonly SceneNode[];
  const hasNumberText = kids.some((c) => {
    if (c.type !== "TEXT") return false;
    const t = (c as TextNode).characters.trim();
    return /^\+?\d{1,4}\+?$/.test(t);
  });
  if (!hasNumberText) return null;
  return { name: "Badge", reason: "소형 + 숫자 텍스트" };
}

function suggestDivider(node: SceneNode): Suggestion | null {
  if (!("width" in node) || !("height" in node)) return null;
  const thinH = node.height <= 2 && node.width >= 40;
  const thinV = node.width <= 2 && node.height >= 40;
  if (!thinH && !thinV) return null;
  const t = node.type;
  if (t !== "LINE" && t !== "RECTANGLE" && t !== "FRAME") return null;
  return { name: "Divider", reason: thinH ? "얇은 가로 라인" : "얇은 세로 라인" };
}

function suggestTitle(node: SceneNode): Suggestion | null {
  if (node.type !== "TEXT") return null;
  const text = node as TextNode;
  const size = text.fontSize;
  if (size === figma.mixed || (size as number) < 20) return null;
  const weight = text.fontWeight;
  if (weight === figma.mixed || (weight as number) < 600) return null;
  return { name: "Title", reason: "크고 굵은 텍스트" };
}

function suggestCaption(node: SceneNode): Suggestion | null {
  if (node.type !== "TEXT") return null;
  const text = node as TextNode;
  const size = text.fontSize;
  if (size === figma.mixed || (size as number) > 14) return null;
  const fills = text.fills;
  if (fills === figma.mixed || !Array.isArray(fills)) return null;
  const solid = fills.find((f) => f.type === "SOLID");
  if (!solid || solid.type !== "SOLID") return null;
  const { r, g, b } = solid.color;
  const isGray = Math.abs(r - g) < 0.05 && Math.abs(g - b) < 0.05 && r < 0.7;
  if (!isGray) return null;
  return { name: "Caption", reason: "작은 회색 계열 텍스트" };
}

// async 룰(suggestFromInstance, suggestFromAutoLayout)과 sync 룰 혼재.
// `await`은 non-Promise 값도 무해하게 통과하므로 호출자에서 일괄 await으로 처리.
const RULES: Array<(node: SceneNode) => Promise<Suggestion | null> | Suggestion | null> = [
  suggestFromInstance,
  suggestFromTextContent,
  suggestAvatar,
  suggestBadge,
  suggestDivider,
  suggestFromAutoLayout,
  suggestBackground,
  suggestHeader,
  suggestBottomNavigation,
  suggestTitle,
  suggestCaption
];

const GENERIC_PARENT_NAMES = new Set([
  "Page 1",
  "Page",
  "Container",
  "Content",
  "Wrapper",
  "Group",
  "Frame"
]);

function isInheritableParent(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return false;
  if (isDefaultName(trimmed)) return false;
  if (GENERIC_PARENT_NAMES.has(trimmed)) return false;
  if (trimmed.length > 40) return false;
  return true;
}

function getSemanticParentPrefix(node: SceneNode): string | null {
  let current: BaseNode | null = node.parent;
  let hops = 0;
  while (current && hops < 4) {
    if (current.type === "PAGE" || current.type === "DOCUMENT") return null;
    const scene = current as SceneNode;
    if (isInheritableParent(scene.name)) {
      const firstSegment = scene.name.split(/\s*\/\s*/)[0].trim();
      return firstSegment || null;
    }
    current = current.parent;
    hops += 1;
  }
  return null;
}

function applyContextInheritance(
  node: SceneNode,
  suggestion: Suggestion
): Suggestion {
  if (suggestion.name.includes("/")) return suggestion;
  const prefix = getSemanticParentPrefix(node);
  if (!prefix) return suggestion;
  if (prefix === suggestion.name) return suggestion;
  return {
    name: `${prefix}/${suggestion.name}`,
    reason: `${suggestion.reason} · 부모 "${prefix}" 계승`
  };
}

function isDetachedSuspect(node: SceneNode): boolean {
  if (node.type !== "FRAME") return false;
  const frame = node as FrameNode;
  if (frame.children.length === 0) return false;
  if (!looksLikeComponentNaming(node.name)) return false;
  if (hasComponentNamedAncestor(node)) return false;
  return true;
}

export async function proposeSemanticNames(root: BaseNode): Promise<NamingSuggestion[]> {
  // walk 콜백이 sync라 async 룰을 못 돌림 → 먼저 노드를 모은 뒤 순차 async 처리.
  const candidates: SceneNode[] = [];
  walk(root, (node) => {
    if (isComponentInternal(node)) return;
    if (node.visible === false || isInsideHidden(node)) return;
    candidates.push(node as SceneNode);
  });

  const suggestions: NamingSuggestion[] = [];
  for (const node of candidates) {
    if (isDefaultName(node.name)) {
      for (const rule of RULES) {
        const hit = await rule(node);
        if (hit) {
          const inherited = applyContextInheritance(node, hit);
          suggestions.push({
            nodeId: node.id,
            nodeType: node.type,
            currentName: node.name,
            suggestedName: inherited.name,
            reason: inherited.reason
          });
          break;
        }
      }
      continue;
    }

    if (isDetachedSuspect(node)) {
      const match = findLdsMatch(node.name);
      if (match) {
        const percent = Math.round(match.score * 100);
        // 교체는 파괴적이라 "양쪽 토큰 집합이 실제로 비슷한 경우"에만 자동 교체 허용.
        // - Jaccard ≥ 0.6: 대칭 유사도. 짧은 쿼리가 긴 후보에 우연히 포함되는 케이스 차단.
        // - 쿼리 토큰 ≥ 3: 1~2 토큰 제네릭 이름("Primary", "Card" 등)의 오탐 차단.
        // score(비대칭 recall 포함)는 UI 표시용으로만 쓰고, 교체 신뢰 판단엔 jaccard 사용.
        const queryTokenCount = tokenListOrdered(node.name).length;
        const trustworthy = match.jaccard >= 0.6 && queryTokenCount >= 3;
        suggestions.push({
          nodeId: node.id,
          nodeType: node.type,
          currentName: node.name,
          suggestedName: match.match,
          reason: trustworthy
            ? `디태치 의심 → LDS 매칭 "${match.match}" (유사도 ${percent}%)`
            : `디태치 의심 → LDS 후보 "${match.match}" (유사도 ${percent}%, 대칭 유사도 ${Math.round(match.jaccard * 100)}%로 낮아 자동 교체는 불가)`,
          ldsComponentKey: trustworthy ? (match.key ?? undefined) : undefined
        });
      }
    }
  }
  return dedupeSiblings(suggestions);
}

function dedupeSiblings(suggestions: NamingSuggestion[]): NamingSuggestion[] {
  const byName = new Map<string, NamingSuggestion[]>();
  for (const s of suggestions) {
    const arr = byName.get(s.suggestedName) ?? [];
    arr.push(s);
    byName.set(s.suggestedName, arr);
  }
  const result: NamingSuggestion[] = [];
  for (const [name, items] of byName) {
    if (items.length === 1) {
      result.push(items[0]);
      continue;
    }
    items.forEach((s, idx) => {
      result.push({
        ...s,
        suggestedName: `${name}${idx + 1}`,
        reason: `${s.reason} · 형제 중복으로 번호 부여`
      });
    });
  }
  return result;
}
