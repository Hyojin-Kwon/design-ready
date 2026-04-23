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

export function checkAbsoluteInsideAutoLayout(node: SceneNode): Issue | null {
  const parent = node.parent;
  if (!parent || parent.type !== "FRAME") return null;
  const frame = parent as FrameNode;
  if (frame.layoutMode === "NONE") return null;
  const positioning = (node as unknown as { layoutPositioning?: "AUTO" | "ABSOLUTE" })
    .layoutPositioning;
  if (positioning !== "ABSOLUTE") return null;
  return {
    id: `absolute-in-autolayout:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "absolute-in-autolayout",
    title: "오토레이아웃 안 절대위치",
    description: `"${node.name}"이 오토레이아웃 프레임 안에서 절대위치로 배치되어 있습니다. Flexbox로 변환 시 position:absolute로 바뀌며, 의도한 흐름이 깨질 수 있습니다.`,
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

