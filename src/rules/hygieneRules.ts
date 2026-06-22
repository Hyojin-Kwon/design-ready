import type { Issue } from "../types";
import { countSceneDescendants, isNearlyInvisible } from "../utils/nodeTraversal";

export function checkHiddenSubtreeRoot(node: SceneNode): Issue | null {
  if (node.visible !== false) return null;
  const descendants = countSceneDescendants(node);
  const suffix = descendants > 0 ? ` (자식 ${descendants}개 포함)` : "";
  return {
    id: `hidden-root:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "unused-hidden-layer",
    title: "삭제 후보: 숨김 레이어",
    description: `"${node.name}"이 숨김 상태입니다${suffix}. 실제 디자인에 안 쓰이면 삭제해주세요.`,
    severity: "warning",
    category: "hygiene",
  };
}

export function checkNearlyInvisible(node: SceneNode): Issue | null {
  if (node.visible === false) return null;
  if (!isNearlyInvisible(node)) return null;
  return {
    id: `zero-opacity:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "zero-opacity",
    title: "삭제 후보: 투명 레이어",
    description: `"${node.name}"의 opacity가 거의 0입니다. 의도된 것이 아니라면 삭제해주세요.`,
    severity: "info",
    category: "hygiene",
  };
}

export function checkEmptyFrame(node: SceneNode): Issue | null {
  if (node.type !== "FRAME") return null;
  const frame = node as FrameNode;
  if (frame.children.length > 0) return null;
  return {
    id: `empty-frame:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "empty-frame",
    title: "삭제 후보: 빈 프레임",
    description: `프레임 "${node.name}"에 자식이 없습니다. 삭제하거나 내용을 채워주세요.`,
    severity: "warning",
    category: "hygiene",
  };
}
