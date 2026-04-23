import type { Issue } from "../types";

const ICON_SIZE_THRESHOLD = 48;
const ICON_NAME_PATTERN = /\b(icon|logo|glyph)\b/i;

function hasImageFill(node: SceneNode): boolean {
  if (!("fills" in node)) return false;
  const fills = (node as GeometryMixin).fills;
  if (!Array.isArray(fills)) return false;
  return fills.some((f) => f.visible !== false && f.type === "IMAGE");
}

function hasVectorDescendant(node: SceneNode): boolean {
  if (!("children" in node)) return false;
  const stack: SceneNode[] = [...((node as ChildrenMixin).children as readonly SceneNode[])];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current.type === "VECTOR" || current.type === "BOOLEAN_OPERATION") return true;
    if ("children" in current) {
      for (const child of (current as ChildrenMixin).children) stack.push(child as SceneNode);
    }
  }
  return false;
}

export function checkRasterInIconSlot(node: SceneNode): Issue | null {
  if (!hasImageFill(node)) return null;
  if (!("width" in node) || !("height" in node)) return null;
  const w = (node as LayoutMixin).width;
  const h = (node as LayoutMixin).height;
  if (w > ICON_SIZE_THRESHOLD || h > ICON_SIZE_THRESHOLD) return null;
  return {
    id: `raster-icon:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "raster-in-icon-slot",
    title: "아이콘 자리에 Raster 이미지",
    description: `"${node.name}"이 ${Math.round(w)}×${Math.round(h)} 크기에 raster 이미지 fill을 사용합니다. 아이콘은 SVG(Vector)로 만들어야 코드 변환 시 <svg>로 선명하게 뽑힙니다.`,
    severity: "warning",
    category: "style"
  };
}

export function checkIconWithoutVector(node: SceneNode): Issue | null {
  if (!ICON_NAME_PATTERN.test(node.name)) return null;
  if (node.type === "VECTOR" || node.type === "BOOLEAN_OPERATION") return null;
  if (node.type === "COMPONENT" || node.type === "INSTANCE" || node.type === "COMPONENT_SET") {
    return null;
  }
  if (!("width" in node) || !("height" in node)) return null;
  const w = (node as LayoutMixin).width;
  const h = (node as LayoutMixin).height;
  if (w > ICON_SIZE_THRESHOLD || h > ICON_SIZE_THRESHOLD) return null;
  if (hasVectorDescendant(node)) return null;
  if (hasImageFill(node)) return null;
  return {
    id: `icon-no-vector:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "icon-without-vector",
    title: "아이콘에 Vector 없음",
    description: `"${node.name}"은 아이콘으로 네이밍되었지만 내부에 vector가 없습니다. SVG로 변환되지 못하고 빈 요소로 뽑힐 수 있습니다.`,
    severity: "info",
    category: "style"
  };
}

const LARGE_RASTER_THRESHOLD = 1024;

export function checkOversizedRaster(node: SceneNode): Issue | null {
  if (!hasImageFill(node)) return null;
  if (!("width" in node) || !("height" in node)) return null;
  const w = (node as LayoutMixin).width;
  const h = (node as LayoutMixin).height;
  if (w < LARGE_RASTER_THRESHOLD && h < LARGE_RASTER_THRESHOLD) return null;
  return {
    id: `raster-oversized:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "raster-oversized",
    title: "큰 Raster 이미지",
    description: `"${node.name}"이 ${Math.round(w)}×${Math.round(h)}px의 큰 raster입니다. 코드에선 <img>로 뽑히므로 export 설정(해상도, 포맷, alt)을 확인해주세요.`,
    severity: "info",
    category: "style"
  };
}
