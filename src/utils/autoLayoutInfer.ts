type Direction = "HORIZONTAL" | "VERTICAL";

export type AutoLayoutInferenceResult =
  | { applied: true }
  | { applied: false; reason: string };

const GAP_TOLERANCE = 4;
const CROSS_ALIGN_TOLERANCE = 2;
const OVERLAP_TOLERANCE = 1;

function isLinearArrangement(
  sorted: readonly SceneNode[],
  direction: Direction
): boolean {
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    if (direction === "HORIZONTAL") {
      if (curr.x + OVERLAP_TOLERANCE < prev.x + prev.width) return false;
    } else {
      if (curr.y + OVERLAP_TOLERANCE < prev.y + prev.height) return false;
    }
  }
  return true;
}

function computeGaps(sorted: readonly SceneNode[], direction: Direction): number[] {
  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    if (direction === "HORIZONTAL") {
      gaps.push(curr.x - (prev.x + prev.width));
    } else {
      gaps.push(curr.y - (prev.y + prev.height));
    }
  }
  return gaps;
}

function detectCounterAlign(
  children: readonly SceneNode[],
  direction: Direction
): "MIN" | "CENTER" | "MAX" {
  if (direction === "HORIZONTAL") {
    const tops = children.map((c) => c.y);
    const centers = children.map((c) => c.y + c.height / 2);
    const bottoms = children.map((c) => c.y + c.height);
    const centerRange = Math.max(...centers) - Math.min(...centers);
    const topRange = Math.max(...tops) - Math.min(...tops);
    const bottomRange = Math.max(...bottoms) - Math.min(...bottoms);
    if (centerRange <= CROSS_ALIGN_TOLERANCE) return "CENTER";
    if (topRange <= CROSS_ALIGN_TOLERANCE) return "MIN";
    if (bottomRange <= CROSS_ALIGN_TOLERANCE) return "MAX";
    return "MIN";
  }
  const lefts = children.map((c) => c.x);
  const centers = children.map((c) => c.x + c.width / 2);
  const rights = children.map((c) => c.x + c.width);
  const centerRange = Math.max(...centers) - Math.min(...centers);
  const leftRange = Math.max(...lefts) - Math.min(...lefts);
  const rightRange = Math.max(...rights) - Math.min(...rights);
  if (centerRange <= CROSS_ALIGN_TOLERANCE) return "CENTER";
  if (leftRange <= CROSS_ALIGN_TOLERANCE) return "MIN";
  if (rightRange <= CROSS_ALIGN_TOLERANCE) return "MAX";
  return "MIN";
}

const CONTAINMENT_TOLERANCE = 1;

function isContainedIn(inner: SceneNode, outer: SceneNode): boolean {
  if (inner === outer) return false;
  const ix1 = inner.x;
  const iy1 = inner.y;
  const ix2 = inner.x + inner.width;
  const iy2 = inner.y + inner.height;
  const ox1 = outer.x - CONTAINMENT_TOLERANCE;
  const oy1 = outer.y - CONTAINMENT_TOLERANCE;
  const ox2 = outer.x + outer.width + CONTAINMENT_TOLERANCE;
  const oy2 = outer.y + outer.height + CONTAINMENT_TOLERANCE;
  return ix1 >= ox1 && iy1 >= oy1 && ix2 <= ox2 && iy2 <= oy2;
}

function extendsBeyondFrame(child: SceneNode, frame: FrameNode): boolean {
  return (
    child.x < -CONTAINMENT_TOLERANCE ||
    child.y < -CONTAINMENT_TOLERANCE ||
    child.x + child.width > frame.width + CONTAINMENT_TOLERANCE ||
    child.y + child.height > frame.height + CONTAINMENT_TOLERANCE
  );
}

function pickContainmentOverlays(children: readonly SceneNode[]): Set<SceneNode> {
  const overlays = new Set<SceneNode>();
  for (const c of children) {
    const cArea = c.width * c.height;
    for (const o of children) {
      if (o === c) continue;
      const oArea = o.width * o.height;
      if (oArea <= cArea) continue;
      if (isContainedIn(c, o)) {
        overlays.add(c);
        break;
      }
    }
  }
  return overlays;
}

function pickBoundaryOverlays(
  children: readonly SceneNode[],
  frame: FrameNode
): Set<SceneNode> {
  const overlays = new Set<SceneNode>();
  for (const c of children) {
    if (extendsBeyondFrame(c, frame)) overlays.add(c);
  }
  return overlays;
}

function findLargestLinearSubset(
  children: readonly SceneNode[],
  direction: Direction
): SceneNode[] {
  // Greedy: sort by primary axis, keep only those that don't overlap the previously kept one.
  const sorted =
    direction === "HORIZONTAL"
      ? [...children].sort((a, b) => a.x - b.x)
      : [...children].sort((a, b) => a.y - b.y);
  const kept: SceneNode[] = [];
  for (const c of sorted) {
    if (kept.length === 0) {
      kept.push(c);
      continue;
    }
    const prev = kept[kept.length - 1];
    const noOverlap =
      direction === "HORIZONTAL"
        ? c.x + OVERLAP_TOLERANCE >= prev.x + prev.width
        : c.y + OVERLAP_TOLERANCE >= prev.y + prev.height;
    if (noOverlap) kept.push(c);
  }
  return kept;
}

export function tryApplyAutoLayout(frame: FrameNode): AutoLayoutInferenceResult {
  if (frame.layoutMode !== "NONE") return { applied: false, reason: "이미 오토레이아웃이 적용됨" };
  const allChildren = frame.children.filter((c) => c.visible !== false);
  if (allChildren.length < 2) return { applied: false, reason: "자식이 2개 미만" };

  // Separate overlay children (contained in sibling, or extending beyond frame).
  const containment = pickContainmentOverlays(allChildren);
  const boundary = pickBoundaryOverlays(allChildren, frame);
  let overlays = new Set<SceneNode>([...containment, ...boundary]);
  let children = allChildren.filter((c) => !overlays.has(c));
  if (children.length === 0) {
    // Relax boundary rule so at least the largest base node becomes flow.
    overlays = new Set<SceneNode>(containment);
    children = allChildren.filter((c) => !overlays.has(c));
  }
  if (children.length === 0) {
    return {
      applied: false,
      reason: "의도된 오버레이 구조로 보임 (auto-layout 부적절)"
    };
  }
  if (children.length === 1) {
    // Single non-overlay child with 1+ overlays is a deliberate overlay composition
    // (e.g. avatar + story ring, icon + badge). Forcing auto-layout breaks the visual
    // anchoring, so skip instead.
    return {
      applied: false,
      reason: "오버레이 합성 구조로 보임 (auto-layout 부적절)"
    };
  }

  const byX = [...children].sort((a, b) => a.x - b.x);
  const byY = [...children].sort((a, b) => a.y - b.y);

  let horizontalLinear = isLinearArrangement(byX, "HORIZONTAL");
  let verticalLinear = isLinearArrangement(byY, "VERTICAL");

  let direction: Direction;
  let sorted: SceneNode[];

  if (horizontalLinear && !verticalLinear) {
    direction = "HORIZONTAL";
    sorted = byX;
  } else if (verticalLinear && !horizontalLinear) {
    direction = "VERTICAL";
    sorted = byY;
  } else if (horizontalLinear && verticalLinear) {
    const xSpread =
      Math.max(...children.map((c) => c.x + c.width)) - Math.min(...children.map((c) => c.x));
    const ySpread =
      Math.max(...children.map((c) => c.y + c.height)) - Math.min(...children.map((c) => c.y));
    if (xSpread >= ySpread) {
      direction = "HORIZONTAL";
      sorted = byX;
    } else {
      direction = "VERTICAL";
      sorted = byY;
    }
  } else {
    // Fallback: find the largest linear subset and kick the rest into overlays.
    const xSubset = findLargestLinearSubset(children, "HORIZONTAL");
    const ySubset = findLargestLinearSubset(children, "VERTICAL");
    const best = xSubset.length >= ySubset.length ? xSubset : ySubset;
    if (best.length < 2) {
      return { applied: false, reason: "자식들이 겹쳐있거나 정렬되지 않음" };
    }
    // 너무 많은 자식을 overlay로 밀어넣으면 디자인이 크게 틀어지므로 스킵.
    // (linear subset이 전체의 75% 미만이면 보수적으로 미적용)
    const coverage = best.length / children.length;
    if (coverage < 0.75) {
      return {
        applied: false,
        reason: `자식 배치가 선형이 아님 (${best.length}/${children.length}만 정렬). 수동 검토 필요.`
      };
    }
    direction = best === xSubset ? "HORIZONTAL" : "VERTICAL";
    sorted = best;
    for (const c of children) if (!best.includes(c)) overlays.add(c);
    children = best;
  }

  const gaps = computeGaps(sorted, direction);
  const minGap = Math.min(...gaps);
  const maxGap = Math.max(...gaps);
  const gapsUniform = maxGap - minGap <= GAP_TOLERANCE;
  const gap = Math.max(0, Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length));

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  let paddingTop = 0;
  let paddingBottom = 0;
  let paddingLeft = 0;
  let paddingRight = 0;

  if (direction === "HORIZONTAL") {
    paddingLeft = Math.round(first.x);
    paddingRight = Math.round(frame.width - (last.x + last.width));
    paddingTop = Math.round(Math.min(...children.map((c) => c.y)));
    paddingBottom = Math.round(
      frame.height - Math.max(...children.map((c) => c.y + c.height))
    );
  } else {
    paddingTop = Math.round(first.y);
    paddingBottom = Math.round(frame.height - (last.y + last.height));
    paddingLeft = Math.round(Math.min(...children.map((c) => c.x)));
    paddingRight = Math.round(
      frame.width - Math.max(...children.map((c) => c.x + c.width))
    );
  }

  // Clamp negative padding (can occur after boundary-overlay relaxation) instead of failing.
  paddingTop = Math.max(0, paddingTop);
  paddingBottom = Math.max(0, paddingBottom);
  paddingLeft = Math.max(0, paddingLeft);
  paddingRight = Math.max(0, paddingRight);

  // If gaps are uneven, check if this is a SPACE_BETWEEN pattern: leading/trailing padding
  // symmetric and relatively small compared to average gap.
  let primaryAxisAlign: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN" = "MIN";
  if (!gapsUniform) {
    const leadPad = direction === "HORIZONTAL" ? paddingLeft : paddingTop;
    const trailPad = direction === "HORIZONTAL" ? paddingRight : paddingBottom;
    const symmetric = Math.abs(leadPad - trailPad) <= GAP_TOLERANCE;
    if (symmetric && gap >= 0) {
      primaryAxisAlign = "SPACE_BETWEEN";
    } else {
      return {
        applied: false,
        reason: `간격이 일정하지 않음 (${Math.round(minGap)}~${Math.round(maxGap)}px)`
      };
    }
  }

  const counterAxis = detectCounterAlign(children, direction);

  // Capture pre-layout positions for overlays so we can restore them afterwards.
  const overlayPositions = new Map<
    SceneNode,
    { x: number; y: number }
  >();
  for (const o of overlays) {
    overlayPositions.set(o, { x: o.x, y: o.y });
  }

  // Place flow children first, then overlays at the end (they'll be opted out of flow anyway).
  for (let i = 0; i < sorted.length; i += 1) {
    frame.insertChild(i, sorted[i]);
  }

  frame.layoutMode = direction;
  frame.itemSpacing = gap;
  frame.paddingTop = paddingTop;
  frame.paddingBottom = paddingBottom;
  frame.paddingLeft = paddingLeft;
  frame.paddingRight = paddingRight;
  frame.primaryAxisAlignItems = primaryAxisAlign;
  frame.counterAxisAlignItems = counterAxis;
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "FIXED";

  // Opt overlays out of the new flex flow and restore their original positions.
  for (const o of overlays) {
    const pos = overlayPositions.get(o);
    // layoutPositioning is available on auto-layout children of Figma FrameNodes.
    (o as unknown as { layoutPositioning?: "AUTO" | "ABSOLUTE" }).layoutPositioning = "ABSOLUTE";
    if (pos) {
      o.x = pos.x;
      o.y = pos.y;
    }
  }

  return { applied: true };
}
