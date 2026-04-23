import type { Issue } from "../types";

function hasVisibleFill(node: SceneNode): boolean {
  if (!("fills" in node)) return false;
  const fills = (node as GeometryMixin).fills;
  if (!Array.isArray(fills)) return false;
  return fills.some((f) => f.visible !== false);
}

function hasVisibleStroke(node: SceneNode): boolean {
  if (!("strokes" in node)) return false;
  const strokes = (node as GeometryMixin).strokes;
  if (!Array.isArray(strokes)) return false;
  return strokes.some((s) => s.visible !== false);
}

function hasVisibleEffects(node: SceneNode): boolean {
  if (!("effects" in node)) return false;
  const effects = (node as BlendMixin).effects;
  if (!Array.isArray(effects)) return false;
  return effects.some((e) => e.visible !== false);
}

function hasPadding(frame: FrameNode): boolean {
  return (
    frame.paddingTop > 0 ||
    frame.paddingBottom > 0 ||
    frame.paddingLeft > 0 ||
    frame.paddingRight > 0
  );
}

function hasCornerRadius(node: SceneNode): boolean {
  const radius = (node as unknown as { cornerRadius?: number | typeof figma.mixed }).cornerRadius;
  return radius === figma.mixed || (typeof radius === "number" && radius > 0);
}

export function checkSingleChildWrapper(node: SceneNode): Issue | null {
  if (node.type !== "FRAME" && node.type !== "GROUP") return null;
  if (!("children" in node)) return null;
  const children = (node as ChildrenMixin).children as readonly SceneNode[];
  if (children.length !== 1) return null;

  const parent = node.parent;
  if (!parent || parent.type === "PAGE" || parent.type === "DOCUMENT") return null;

  if (node.type === "GROUP") {
    return {
      id: `wrapper-group:${node.id}`,
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      ruleId: "single-child-group",
      title: "불필요한 단일 자식 그룹",
      description: `그룹 "${node.name}"에 자식이 1개뿐입니다. 그룹을 해제하면 코드 변환 시 불필요한 <div> 중첩이 줄어듭니다.`,
      severity: "info",
      category: "layout"
    };
  }

  const frame = node as FrameNode;
  const hasStyling =
    hasVisibleFill(frame) ||
    hasVisibleStroke(frame) ||
    hasVisibleEffects(frame) ||
    hasCornerRadius(frame) ||
    hasPadding(frame) ||
    frame.layoutMode !== "NONE" ||
    (typeof frame.clipsContent === "boolean" && frame.clipsContent);
  if (hasStyling) return null;

  return {
    id: `wrapper-frame:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "single-child-frame-wrapper",
    title: "불필요한 단일 자식 프레임",
    description: `프레임 "${node.name}"에 자식이 1개이고 배경/패딩/레이아웃이 없습니다. 자식만 남겨도 결과가 동일하며 코드 중첩이 줄어듭니다.`,
    severity: "info",
    category: "layout"
  };
}
