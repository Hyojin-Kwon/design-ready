import type { Issue } from "../types";
import { findLdsMatch, isCompositeContainer } from "../ai/ldsMatch";
import { isInsideIcon } from "../utils/nodeTraversal";

const PRIMITIVE_SHAPE_TYPES: ReadonlyArray<SceneNode["type"]> = [
  "VECTOR",
  "BOOLEAN_OPERATION",
  "RECTANGLE",
  "ELLIPSE",
  "STAR",
  "POLYGON",
  "LINE"
];

const DEFAULT_NAME_PATTERN =
  /^(Frame|Group|Rectangle|Vector|Ellipse|Line|Text|Component|Instance|Polygon|Star)(\s\d+)?$/;

export function isDefaultName(name: string): boolean {
  return DEFAULT_NAME_PATTERN.test(name.trim());
}

export function looksLikeComponentNaming(name: string): boolean {
  return name.includes("/") && /^[A-Z]/.test(name);
}

export function checkDefaultNaming(node: SceneNode): Issue | null {
  if (!isDefaultName(node.name)) return null;
  if (PRIMITIVE_SHAPE_TYPES.includes(node.type) && isInsideIcon(node)) return null;
  return {
    id: `naming:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "default-naming",
    title: "디폴트 레이어 이름",
    description: `"${node.name}"은 자동 생성된 이름입니다. 시맨틱하게 바꿔주세요 (예: Header/NavigationBar).`,
    severity: "warning",
    category: "naming"
  };
}

export function hasComponentNamedAncestor(node: SceneNode): boolean {
  let current: BaseNode | null = node.parent;
  while (current) {
    if (current.type === "PAGE" || current.type === "DOCUMENT") return false;
    if (looksLikeComponentNaming(current.name)) return true;
    current = current.parent;
  }
  return false;
}

export function checkDetachedInstance(node: SceneNode): Issue | null {
  if (node.type !== "FRAME") return null;
  if (!looksLikeComponentNaming(node.name)) return null;
  // 합성 컨테이너(Flex Message, Chatroom 등)는 1:1 교체 대상이 아니므로
  // 상위 프레임을 디태치로 표시하지 않음. 자식 레벨 매칭은 그대로 진행.
  if (isCompositeContainer(node.name)) return null;
  const frame = node as FrameNode;
  if (frame.children.length === 0) return null;
  if (hasComponentNamedAncestor(node)) return null;
  const match = findLdsMatch(node.name);
  const description = match
    ? `프레임 "${node.name}"이 LDS "${match.match}"과 유사도 ${Math.round(match.score * 100)}%. 디태치된 인스턴스일 가능성이 높습니다.`
    : `프레임 "${node.name}"이 컴포넌트 컨벤션 이름이지만 INSTANCE가 아니고, LDS에서 매칭 후보도 찾지 못했습니다. 디태치 후 이름을 변경한 프레임일 수 있습니다 — Figma Assets 패널에서 원본 컴포넌트를 찾아 수동으로 교체해주세요.`;
  return {
    id: `detached:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "detached-instance",
    title: "디태치된 인스턴스 의심",
    description,
    severity: "critical",
    category: "system"
  };
}
