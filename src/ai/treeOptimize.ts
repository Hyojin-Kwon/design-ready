import type { SerializedNode } from "./conversionSerialize";

export interface OptimizeStats {
  beforeNodes: number;
  afterNodes: number;
  flattenedGroups: number;
  flattenedFrames: number;
  inferredLayouts: number;
}

export interface InferredLayout {
  mode: "HORIZONTAL" | "VERTICAL";
  gap: number;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  primaryAxisAlign: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";
  counterAxisAlign: "MIN" | "CENTER" | "MAX";
}

declare module "./conversionSerialize" {
  interface SerializedNode {
    inferredLayout?: InferredLayout;
    repeatCount?: number;
  }
}

const GAP_TOLERANCE = 4;
const CROSS_TOLERANCE = 2;
const OVERLAP_TOLERANCE = 1;

function countNodes(n: SerializedNode): number {
  let c = 1;
  if (n.children) for (const k of n.children) c += countNodes(k);
  return c;
}

function hasVisualProps(n: SerializedNode): boolean {
  return Boolean(
    n.fill ||
      n.stroke ||
      n.cornerRadius ||
      (n.effects && n.effects.length > 0) ||
      n.componentRef ||
      n.text ||
      n.iconId ||
      n.layout
  );
}

function isWrapperCandidate(n: SerializedNode): boolean {
  if (n.type === "GROUP") {
    // GROUPs have no visual props of their own to speak of; 1-child GROUP is pure noise.
    return !hasVisualProps(n) && !!n.children && n.children.length === 1;
  }
  if (n.type === "FRAME") {
    // Conservative FRAME flatten: no layout, no visual props, single child, not absolute-anchored,
    // and no bound tokens (those are semantic).
    return (
      !hasVisualProps(n) &&
      !n.boundTokens &&
      !!n.children &&
      n.children.length === 1 &&
      !n.absolute
    );
  }
  return false;
}

function flattenGroupWrappers(n: SerializedNode, stats: OptimizeStats): SerializedNode {
  if (n.children) {
    const next: SerializedNode[] = [];
    for (const c of n.children) {
      let optimized = flattenGroupWrappers(c, stats);
      // Collapse chains: A(wrapper) > B(wrapper) > C → C, with best-name inheritance.
      while (isWrapperCandidate(optimized)) {
        const only = optimized.children![0];
        if (!only.name || /^(Frame|Group|Rectangle|Vector)\s*\d*$/.test(only.name)) {
          only.name = optimized.name;
        }
        // Propagate absolute positioning from parent wrapper if present.
        if (typeof optimized.x === "number" && only.x === undefined) only.x = optimized.x;
        if (typeof optimized.y === "number" && only.y === undefined) only.y = optimized.y;
        if (optimized.type === "GROUP") stats.flattenedGroups += 1;
        else stats.flattenedFrames += 1;
        optimized = only;
      }
      next.push(optimized);
    }
    n.children = next;
  }
  return n;
}

function hasChildrenCoords(children: SerializedNode[]): boolean {
  return children.every(
    (c) =>
      typeof c.x === "number" &&
      typeof c.y === "number" &&
      typeof c.width === "number" &&
      typeof c.height === "number"
  );
}

function inferLayoutFor(
  parent: SerializedNode,
  children: SerializedNode[]
): InferredLayout | undefined {
  if (children.length < 2) return undefined;
  if (!hasChildrenCoords(children)) return undefined;
  if (typeof parent.width !== "number" || typeof parent.height !== "number") return undefined;

  type C = SerializedNode & { x: number; y: number; width: number; height: number };
  const typed = children as C[];

  // Try horizontal
  const byX = [...typed].sort((a, b) => a.x - b.x);
  let horizontal = true;
  for (let i = 1; i < byX.length; i += 1) {
    if (byX[i].x + OVERLAP_TOLERANCE < byX[i - 1].x + byX[i - 1].width) {
      horizontal = false;
      break;
    }
  }
  const byY = [...typed].sort((a, b) => a.y - b.y);
  let vertical = true;
  for (let i = 1; i < byY.length; i += 1) {
    if (byY[i].y + OVERLAP_TOLERANCE < byY[i - 1].y + byY[i - 1].height) {
      vertical = false;
      break;
    }
  }
  if (!horizontal && !vertical) return undefined;

  // Prefer direction with tighter cross-axis alignment
  const direction: "HORIZONTAL" | "VERTICAL" = horizontal && !vertical
    ? "HORIZONTAL"
    : vertical && !horizontal
      ? "VERTICAL"
      : pickDirection(typed);

  const sorted = direction === "HORIZONTAL" ? byX : byY;

  // Gaps
  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    if (direction === "HORIZONTAL") gaps.push(curr.x - (prev.x + prev.width));
    else gaps.push(curr.y - (prev.y + prev.height));
  }
  const minGap = Math.min(...gaps);
  const maxGap = Math.max(...gaps);
  const uniformGap = maxGap - minGap <= GAP_TOLERANCE;

  // Padding = leading/trailing margin from parent bounds
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  let paddingTop = 0;
  let paddingBottom = 0;
  let paddingLeft = 0;
  let paddingRight = 0;

  if (direction === "HORIZONTAL") {
    paddingLeft = Math.max(0, first.x);
    paddingRight = Math.max(0, parent.width - (last.x + last.width));
    // cross padding: all children share similar y
    const minY = Math.min(...typed.map((c) => c.y));
    const maxBottom = Math.max(...typed.map((c) => c.y + c.height));
    paddingTop = Math.max(0, minY);
    paddingBottom = Math.max(0, parent.height - maxBottom);
  } else {
    paddingTop = Math.max(0, first.y);
    paddingBottom = Math.max(0, parent.height - (last.y + last.height));
    const minX = Math.min(...typed.map((c) => c.x));
    const maxRight = Math.max(...typed.map((c) => c.x + c.width));
    paddingLeft = Math.max(0, minX);
    paddingRight = Math.max(0, parent.width - maxRight);
  }

  const counterAxisAlign = detectCounterAlign(typed, direction);
  const primaryAxisAlign = uniformGap
    ? "MIN"
    : detectPrimaryAlign(typed, direction, parent);

  const gap = uniformGap ? Math.max(0, Math.round(minGap)) : Math.max(0, Math.round(minGap));

  return {
    mode: direction,
    gap,
    paddingTop: Math.round(paddingTop),
    paddingBottom: Math.round(paddingBottom),
    paddingLeft: Math.round(paddingLeft),
    paddingRight: Math.round(paddingRight),
    primaryAxisAlign,
    counterAxisAlign
  };
}

function pickDirection(
  children: Array<SerializedNode & { x: number; y: number; width: number; height: number }>
): "HORIZONTAL" | "VERTICAL" {
  const ys = children.map((c) => c.y);
  const xs = children.map((c) => c.x);
  const yRange = Math.max(...ys) - Math.min(...ys);
  const xRange = Math.max(...xs) - Math.min(...xs);
  return xRange > yRange ? "HORIZONTAL" : "VERTICAL";
}

function detectCounterAlign(
  children: Array<SerializedNode & { x: number; y: number; width: number; height: number }>,
  direction: "HORIZONTAL" | "VERTICAL"
): "MIN" | "CENTER" | "MAX" {
  if (direction === "HORIZONTAL") {
    const tops = children.map((c) => c.y);
    const centers = children.map((c) => c.y + c.height / 2);
    const bottoms = children.map((c) => c.y + c.height);
    if (Math.max(...centers) - Math.min(...centers) <= CROSS_TOLERANCE) return "CENTER";
    if (Math.max(...tops) - Math.min(...tops) <= CROSS_TOLERANCE) return "MIN";
    if (Math.max(...bottoms) - Math.min(...bottoms) <= CROSS_TOLERANCE) return "MAX";
    return "MIN";
  }
  const lefts = children.map((c) => c.x);
  const centers = children.map((c) => c.x + c.width / 2);
  const rights = children.map((c) => c.x + c.width);
  if (Math.max(...centers) - Math.min(...centers) <= CROSS_TOLERANCE) return "CENTER";
  if (Math.max(...lefts) - Math.min(...lefts) <= CROSS_TOLERANCE) return "MIN";
  if (Math.max(...rights) - Math.min(...rights) <= CROSS_TOLERANCE) return "MAX";
  return "MIN";
}

function detectPrimaryAlign(
  children: Array<SerializedNode & { x: number; y: number; width: number; height: number }>,
  direction: "HORIZONTAL" | "VERTICAL",
  parent: SerializedNode
): "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN" {
  if (children.length < 2) return "MIN";
  const first = children[0];
  const last = children[children.length - 1];
  const pw = typeof parent.width === "number" ? parent.width : 0;
  const ph = typeof parent.height === "number" ? parent.height : 0;
  if (direction === "HORIZONTAL") {
    const leadMargin = first.x;
    const trailMargin = pw - (last.x + last.width);
    if (Math.abs(leadMargin - trailMargin) <= CROSS_TOLERANCE && leadMargin > 0) {
      // Could be CENTER or SPACE_BETWEEN — check internal gaps
      const gaps: number[] = [];
      for (let i = 1; i < children.length; i += 1) {
        gaps.push(children[i].x - (children[i - 1].x + children[i - 1].width));
      }
      const gapMax = Math.max(...gaps);
      const gapMin = Math.min(...gaps);
      if (gapMax - gapMin > GAP_TOLERANCE) return "SPACE_BETWEEN";
      return "CENTER";
    }
    return leadMargin <= trailMargin ? "MIN" : "MAX";
  }
  const leadMargin = first.y;
  const trailMargin = ph - (last.y + last.height);
  if (Math.abs(leadMargin - trailMargin) <= CROSS_TOLERANCE && leadMargin > 0) {
    const gaps: number[] = [];
    for (let i = 1; i < children.length; i += 1) {
      gaps.push(children[i].y - (children[i - 1].y + children[i - 1].height));
    }
    const gapMax = Math.max(...gaps);
    const gapMin = Math.min(...gaps);
    if (gapMax - gapMin > GAP_TOLERANCE) return "SPACE_BETWEEN";
    return "CENTER";
  }
  return leadMargin <= trailMargin ? "MIN" : "MAX";
}

function inferLayouts(n: SerializedNode, stats: OptimizeStats): void {
  if (n.children && n.children.length > 0) {
    for (const c of n.children) inferLayouts(c, stats);
    if (!n.layout && !n.inferredLayout) {
      const inferred = inferLayoutFor(n, n.children);
      if (inferred) {
        n.inferredLayout = inferred;
        stats.inferredLayouts += 1;
      }
    }
  }
}

export function optimizeTree(root: SerializedNode): { tree: SerializedNode; stats: OptimizeStats } {
  const stats: OptimizeStats = {
    beforeNodes: countNodes(root),
    afterNodes: 0,
    flattenedGroups: 0,
    flattenedFrames: 0,
    inferredLayouts: 0
  };
  const flattened = flattenGroupWrappers(root, stats);
  inferLayouts(flattened, stats);
  stats.afterNodes = countNodes(flattened);
  return { tree: flattened, stats };
}
