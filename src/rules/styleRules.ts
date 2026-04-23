import type { Issue } from "../types";
import { isInsideIcon } from "../utils/nodeTraversal";

const ICON_SHAPE_TYPES: ReadonlyArray<SceneNode["type"]> = [
  "RECTANGLE",
  "ELLIPSE",
  "STAR",
  "POLYGON",
  "LINE"
];

const ILLUSTRATION_NAME_PATTERN = /\b(illustration|illust|artwork|image|photo|picture|graphic|bg|background)\b/i;

// 일러스트/벡터 아트워크 내부인지. 토큰 대상 아님.
function isInsideIllustration(node: SceneNode): boolean {
  let current: BaseNode | null = node.parent;
  while (current) {
    if (current.type === "PAGE" || current.type === "DOCUMENT") return false;
    if (current.type === "VECTOR" || current.type === "BOOLEAN_OPERATION") return true;
    const scene = current as SceneNode;
    if (ILLUSTRATION_NAME_PATTERN.test(scene.name)) return true;
    current = current.parent;
  }
  return false;
}

// fills에 IMAGE 페인트가 하나라도 있으면 이미지 노드로 간주 (색 토큰 대상 아님).
function hasImagePaint(node: SceneNode): boolean {
  if (!("fills" in node)) return false;
  const fills = (node as GeometryMixin).fills;
  if (fills === figma.mixed || !Array.isArray(fills)) return false;
  return fills.some((f) => f.visible !== false && f.type === "IMAGE");
}

// fills가 그라데이션만 있으면 스킵 (일회성 연출).
function hasOnlyGradientFill(node: SceneNode): boolean {
  if (!("fills" in node)) return false;
  const fills = (node as GeometryMixin).fills;
  if (fills === figma.mixed || !Array.isArray(fills)) return false;
  const visible = fills.filter((f) => f.visible !== false);
  if (visible.length === 0) return false;
  return visible.every((f) => f.type.startsWith("GRADIENT_"));
}

// 이미지 위에 올린 딤(dim) 오버레이: 형제 중 이미지 노드가 있고,
// 본인은 opacity<0.8 의 SOLID fill Rectangle.
function isOverlayOnImage(node: SceneNode): boolean {
  if (node.type !== "RECTANGLE" && node.type !== "FRAME") return false;
  if (!("fills" in node)) return false;
  const fills = (node as GeometryMixin).fills;
  if (fills === figma.mixed || !Array.isArray(fills)) return false;
  const solid = fills.find((f) => f.visible !== false && f.type === "SOLID");
  if (!solid) return false;
  const opacity =
    (node as BlendMixin).opacity ??
    (solid as SolidPaint).opacity ??
    1;
  if (opacity >= 0.8) return false;
  const parent = node.parent;
  if (!parent || !("children" in parent)) return false;
  const siblings = (parent as ChildrenMixin).children as readonly SceneNode[];
  return siblings.some((s) => s.id !== node.id && hasImagePaint(s));
}

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

function getBoundVariables(node: SceneNode): Record<string, unknown> | undefined {
  return (node as unknown as { boundVariables?: Record<string, unknown> }).boundVariables;
}

function hasVisibleStroke(node: SceneNode): boolean {
  if (!("strokes" in node)) return false;
  const strokes = (node as GeometryMixin).strokes;
  if (!Array.isArray(strokes)) return false;
  return strokes.some((s) => s.visible !== false && s.type === "SOLID");
}

function hasVisibleEffects(node: SceneNode): boolean {
  if (!("effects" in node)) return false;
  const effects = (node as BlendMixin).effects;
  if (!Array.isArray(effects)) return false;
  return effects.some((e) => e.visible !== false);
}

function styleIdPresent(id: unknown): boolean {
  return typeof id === "string" && id !== "";
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
  if (isInsideIllustration(node)) return null;
  if (hasImagePaint(node)) return null;
  if (hasOnlyGradientFill(node)) return null;
  if (isOverlayOnImage(node)) return null;
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

export function checkStrokeTokenMissing(node: SceneNode): Issue | null {
  if (ICON_SHAPE_TYPES.includes(node.type) && isInsideIcon(node)) return null;
  if (isInsideIllustration(node)) return null;
  if (!hasVisibleStroke(node)) return null;
  const strokeStyleId = (node as unknown as { strokeStyleId?: string | typeof figma.mixed })
    .strokeStyleId;
  if (styleIdPresent(strokeStyleId)) return null;
  const bound = getBoundVariables(node);
  if (bound && bound["strokes"]) return null;
  return {
    id: `stroke-token:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "stroke-token-missing",
    title: "LDS 토큰 미연결 스트로크",
    description: `"${node.name}"의 스트로크가 로컬 컬러를 사용합니다. LDS 컬러 토큰에 연결하면 border-color가 변수로 추출됩니다.`,
    severity: "info",
    category: "style"
  };
}

export function checkEffectTokenMissing(node: SceneNode): Issue | null {
  if (isInsideIllustration(node)) return null;
  if (!hasVisibleEffects(node)) return null;
  const effectStyleId = (node as unknown as { effectStyleId?: string | typeof figma.mixed })
    .effectStyleId;
  if (styleIdPresent(effectStyleId)) return null;
  return {
    id: `effect-token:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "effect-token-missing",
    title: "LDS 토큰 미연결 이펙트",
    description: `"${node.name}"에 그림자/블러가 로컬 값으로 적용되어 있습니다. LDS 이펙트 스타일에 연결하면 box-shadow 토큰이 일관됩니다.`,
    severity: "info",
    category: "style"
  };
}

const RADIUS_KEYS = [
  "topLeftRadius",
  "topRightRadius",
  "bottomLeftRadius",
  "bottomRightRadius"
] as const;

export function checkRadiusTokenMissing(node: SceneNode): Issue | null {
  const radius = (node as unknown as { cornerRadius?: number | typeof figma.mixed }).cornerRadius;
  const hasUniformRadius = typeof radius === "number" && radius > 0;
  const hasMixedRadius = radius === figma.mixed;
  if (!hasUniformRadius && !hasMixedRadius) return null;
  if (isInsideIllustration(node)) return null;
  const bound = getBoundVariables(node);
  if (bound) {
    if (hasUniformRadius && bound["topLeftRadius"]) return null;
    if (hasMixedRadius && RADIUS_KEYS.every((k) => bound[k])) return null;
  }
  return {
    id: `radius-token:${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    ruleId: "radius-token-missing",
    title: "LDS 토큰 미연결 라운드",
    description: `"${node.name}"의 코너 반경이 하드코딩되어 있습니다. 숫자 변수에 연결하면 border-radius가 토큰으로 뽑힙니다.`,
    severity: "info",
    category: "style"
  };
}

const SPACING_KEYS = [
  "itemSpacing",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "paddingBottom"
] as const;

export function hasSpacingVariablesInFile(): boolean {
  try {
    const floats = figma.variables.getLocalVariables("FLOAT");
    return floats.some((v) => /spacing|gap|padding|space/i.test(v.name));
  } catch {
    return false;
  }
}

export function createSpacingTokenCheck(
  enabled: boolean
): (node: SceneNode) => Issue | null {
  if (!enabled) return () => null;
  return (node) => {
    if (node.type !== "FRAME" && node.type !== "COMPONENT" && node.type !== "INSTANCE") {
      return null;
    }
    const frame = node as FrameNode;
    if (frame.layoutMode === "NONE") return null;
    const bound = getBoundVariables(node) ?? {};
    const values = frame as unknown as Record<string, number>;
    const unbound: string[] = [];
    for (const key of SPACING_KEYS) {
      const v = values[key];
      if (typeof v !== "number" || v <= 0) continue;
      if (!bound[key]) unbound.push(key);
    }
    if (unbound.length === 0) return null;
    return {
      id: `spacing-token:${node.id}`,
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      ruleId: "spacing-token-missing",
      title: "LDS 토큰 미연결 간격",
      description: `"${node.name}"의 padding/gap이 하드코딩되어 있습니다(${unbound.length}개 값). 파일에 정의된 스페이싱 변수에 연결해주세요.`,
      severity: "info",
      category: "style"
    };
  };
}
