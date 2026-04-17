import type { Issue } from "../types";
import { getGroupDepth } from "../utils/nodeTraversal";

export function checkMissingAutoLayout(node: SceneNode): Issue | null {
  if (node.type !== "FRAME") return null;
  const frame = node as FrameNode;
  if (frame.layoutMode !== "NONE") return null;
  if (frame.children.length < 2) return null;
  return {
    id: `autolayout:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "missing-auto-layout",
    title: "오토레이아웃 미적용",
    description: `프레임 "${node.name}"에 자식이 ${frame.children.length}개 있지만 오토레이아웃이 꺼져 있습니다. 반응형 동작을 위해 적용해주세요.`,
    severity: "warning",
    category: "layout"
  };
}

export function checkGroupNestingDepth(node: SceneNode): Issue | null {
  if (node.type !== "GROUP") return null;
  const depth = getGroupDepth(node);
  if (depth < 3) return null;
  return {
    id: `group-depth:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "deep-group-nesting",
    title: "과도한 그룹 중첩",
    description: `그룹 "${node.name}"이 ${depth}단계 깊이로 중첩되어 있습니다. 평탄화하거나 프레임으로 전환을 고려해주세요.`,
    severity: "info",
    category: "layout"
  };
}

