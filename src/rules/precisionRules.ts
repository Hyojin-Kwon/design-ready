import type { Issue } from "../types";

const EPS = 0.001;

function isFractional(value: number | undefined): boolean {
  if (typeof value !== "number") return false;
  return Math.abs(value - Math.round(value)) > EPS;
}

const SPACING_KEYS = [
  "itemSpacing",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "paddingBottom"
] as const;

export function checkSubpixelSpacing(node: SceneNode): Issue | null {
  if (node.type !== "FRAME" && node.type !== "COMPONENT" && node.type !== "INSTANCE") return null;
  const frame = node as FrameNode;
  if (frame.layoutMode === "NONE") return null;
  const values = frame as unknown as Record<string, number>;
  const fractional: string[] = [];
  for (const key of SPACING_KEYS) {
    if (isFractional(values[key])) fractional.push(key);
  }
  if (fractional.length === 0) return null;
  return {
    id: `subpixel-spacing:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "subpixel-spacing",
    title: "서브픽셀 간격",
    description: `"${node.name}"의 padding/gap에 소수점 값이 있습니다(${fractional.length}개). 코드 변환 시 반올림되어 레이아웃이 어긋날 수 있습니다.`,
    severity: "info",
    category: "hygiene"
  };
}

export function checkSubpixelPosition(node: SceneNode): Issue | null {
  const parent = node.parent;
  if (!parent) return null;
  if (parent.type === "PAGE" || parent.type === "DOCUMENT") return null;
  if (parent.type === "FRAME" && (parent as FrameNode).layoutMode !== "NONE") {
    const positioning = (node as unknown as { layoutPositioning?: "AUTO" | "ABSOLUTE" })
      .layoutPositioning;
    if (positioning !== "ABSOLUTE") return null;
  }
  if (!("x" in node) || !("y" in node)) return null;
  const x = (node as LayoutMixin).x;
  const y = (node as LayoutMixin).y;
  if (!isFractional(x) && !isFractional(y)) return null;
  return {
    id: `subpixel-position:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "subpixel-position",
    title: "서브픽셀 위치",
    description: `"${node.name}"이 (${x.toFixed(2)}, ${y.toFixed(2)})에 배치되어 있습니다. 정수 좌표로 맞춰주세요.`,
    severity: "info",
    category: "hygiene"
  };
}

const SIZE_EXEMPT_TYPES: ReadonlyArray<SceneNode["type"]> = [
  "TEXT",
  "VECTOR",
  "BOOLEAN_OPERATION",
  "STAR",
  "POLYGON",
  "LINE"
];

export function checkSubpixelSize(node: SceneNode): Issue | null {
  if (SIZE_EXEMPT_TYPES.includes(node.type)) return null;
  if (!("width" in node) || !("height" in node)) return null;
  const w = (node as LayoutMixin).width;
  const h = (node as LayoutMixin).height;
  if (!isFractional(w) && !isFractional(h)) return null;
  return {
    id: `subpixel-size:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "subpixel-size",
    title: "서브픽셀 크기",
    description: `"${node.name}"의 크기가 ${w.toFixed(2)} × ${h.toFixed(2)}입니다. 정수 픽셀로 맞춰주세요.`,
    severity: "info",
    category: "hygiene"
  };
}
