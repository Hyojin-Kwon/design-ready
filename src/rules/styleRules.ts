import type { Issue } from "../types";
import { isInsideIcon } from "../utils/nodeTraversal";

const ICON_SHAPE_TYPES: ReadonlyArray<SceneNode["type"]> = [
  "RECTANGLE",
  "ELLIPSE",
  "STAR",
  "POLYGON",
  "LINE"
];

function hasVisibleSolidFill(node: SceneNode): boolean {
  if (!("fills" in node)) return false;
  const fills = (node as GeometryMixin).fills;
  if (fills === figma.mixed) return true;
  if (!Array.isArray(fills)) return false;
  return fills.some((f) => f.visible !== false && f.type === "SOLID");
}

function hasBoundColorVariable(node: SceneNode): boolean {
  const bound = (node as unknown as { boundVariables?: Record<string, unknown> }).boundVariables;
  if (!bound) return false;
  return Boolean(bound["fills"]) || Boolean(bound["strokes"]);
}

export function checkStyleOrTokenMissing(node: SceneNode): Issue | null {
  if (node.type === "TEXT") {
    const text = node as TextNode;
    if (text.textStyleId && text.textStyleId !== "") return null;
    return {
      id: `text-style:${node.id}`,
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      ruleId: "text-style-missing",
      title: "텍스트 스타일 미적용",
      description: `텍스트 "${node.name}"이 로컬 타이포그래피를 사용합니다. LDS 텍스트 스타일을 적용해주세요.`,
      severity: "info",
      category: "style"
    };
  }

  if (node.type === "VECTOR" || node.type === "BOOLEAN_OPERATION") return null;
  if (ICON_SHAPE_TYPES.includes(node.type) && isInsideIcon(node)) return null;
  if (!("fillStyleId" in node)) return null;
  if (!hasVisibleSolidFill(node)) return null;

  const styleId = (node as unknown as { fillStyleId: string | typeof figma.mixed }).fillStyleId;
  const hasStyle = styleId !== "" && styleId !== figma.mixed;
  if (hasStyle) return null;
  if (hasBoundColorVariable(node)) return null;

  return {
    id: `fill-style:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "fill-token-missing",
    title: "LDS 토큰 미연결 컬러",
    description: `"${node.name}"이 로컬 컬러를 사용합니다. LDS 컬러 스타일이나 변수에 연결해주세요.`,
    severity: "info",
    category: "style"
  };
}
