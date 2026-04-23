export type AnyNode = BaseNode & { children?: readonly SceneNode[] };

// 스캔 시 페이지 직계 최상위 프레임을 이 ID 집합으로 제한한다.
// 예: 프로토타입 연결 플로우에 포함된 프레임만 스캔하고 싶을 때.
// null 이면 필터 없음(모든 top-level 프레임 스캔).
let topLevelFilter: Set<string> | null = null;

export function setTopLevelFilter(ids: Set<string> | null): void {
  topLevelFilter = ids;
}

export function walk(root: BaseNode, visit: (node: SceneNode, depth: number) => void): void {
  function recurse(node: BaseNode, depth: number) {
    if (!("children" in node)) return;
    const children = node.children as readonly BaseNode[];
    for (const child of children) {
      if (child.type === "PAGE") {
        recurse(child, depth);
        continue;
      }
      // 페이지 바로 아래 최상위 노드에서 필터 적용
      if (
        topLevelFilter &&
        node.type === "PAGE" &&
        !topLevelFilter.has((child as SceneNode).id)
      ) {
        continue;
      }
      visit(child as SceneNode, depth);
      recurse(child, depth + 1);
    }
  }
  recurse(root, 0);
}

export function countNodes(root: BaseNode): number {
  let count = 0;
  walk(root, () => {
    count += 1;
  });
  return count;
}

export function hasChildren(node: BaseNode): node is BaseNode & ChildrenMixin {
  return "children" in node;
}

export function getGroupDepth(node: SceneNode): number {
  let depth = 0;
  let current: BaseNode | null = node.parent;
  while (current && current.type === "GROUP") {
    depth += 1;
    current = current.parent;
  }
  return depth;
}

export function isInsideHidden(node: SceneNode): boolean {
  let current: BaseNode | null = node.parent;
  while (current) {
    if (current.type === "PAGE" || current.type === "DOCUMENT") return false;
    if ("visible" in current && (current as SceneNode).visible === false) return true;
    current = current.parent;
  }
  return false;
}

const ICON_NAME_PATTERN = /\b(icon|logo|glyph)\b/i;
const ICON_SIZE_THRESHOLD = 64;

const textPresenceCache = new WeakMap<BaseNode, boolean>();

function hasTextDescendant(node: BaseNode): boolean {
  const cached = textPresenceCache.get(node);
  if (cached !== undefined) return cached;
  if (!("children" in node)) {
    textPresenceCache.set(node, false);
    return false;
  }
  const children = (node as ChildrenMixin).children as readonly SceneNode[];
  for (const child of children) {
    if (child.type === "TEXT") {
      textPresenceCache.set(node, true);
      return true;
    }
    if (hasTextDescendant(child)) {
      textPresenceCache.set(node, true);
      return true;
    }
  }
  textPresenceCache.set(node, false);
  return false;
}

export function isInsideIcon(node: SceneNode): boolean {
  if ("width" in node && "height" in node) {
    if (node.width <= ICON_SIZE_THRESHOLD && node.height <= ICON_SIZE_THRESHOLD) {
      if (ICON_NAME_PATTERN.test(node.name)) return true;
    }
  }
  let current: BaseNode | null = node.parent;
  while (current) {
    if (current.type === "PAGE" || current.type === "DOCUMENT") return false;
    const scene = current as SceneNode;
    if (ICON_NAME_PATTERN.test(scene.name)) return true;
    const isContainer =
      scene.type === "FRAME" ||
      scene.type === "COMPONENT" ||
      scene.type === "INSTANCE" ||
      scene.type === "GROUP";
    if (isContainer) {
      if (
        "width" in scene &&
        "height" in scene &&
        scene.width <= ICON_SIZE_THRESHOLD &&
        scene.height <= ICON_SIZE_THRESHOLD
      ) {
        return true;
      }
      if (!hasTextDescendant(scene)) return true;
    }
    current = current.parent;
  }
  return false;
}

export function isNearlyInvisible(node: SceneNode): boolean {
  if (!("opacity" in node)) return false;
  const opacity = (node as BlendMixin).opacity;
  return typeof opacity === "number" && opacity <= 0.01;
}

export function countSceneDescendants(node: SceneNode): number {
  if (!("children" in node)) return 0;
  let count = 0;
  const stack: readonly SceneNode[] = [...(node as ChildrenMixin).children as readonly SceneNode[]];
  const queue: SceneNode[] = [...stack];
  while (queue.length > 0) {
    const current = queue.pop()!;
    count += 1;
    if ("children" in current) {
      for (const c of (current as ChildrenMixin).children) queue.push(c as SceneNode);
    }
  }
  return count;
}

export function isComponentInternal(node: SceneNode): boolean {
  let current: BaseNode | null = node.parent;
  while (current) {
    if (
      current.type === "INSTANCE" ||
      current.type === "COMPONENT" ||
      current.type === "COMPONENT_SET"
    ) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

export function approxEqual(a: number, b: number, tolerance = 1): boolean {
  return Math.abs(a - b) <= tolerance;
}

export function isSameSizeAsParent(node: SceneNode): boolean {
  const parent = node.parent;
  if (!parent || !("width" in parent) || !("height" in parent)) return false;
  if (!("width" in node) || !("height" in node)) return false;
  const p = parent as unknown as { width: number; height: number };
  return approxEqual(node.width, p.width) && approxEqual(node.height, p.height);
}
