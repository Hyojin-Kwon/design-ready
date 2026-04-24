export interface SerializedNode {
  id: string;
  type: string;
  name: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  absolute?: boolean;
  anchorParent?: string;
  constraints?: { horizontal: string; vertical: string };
  layout?: {
    mode: "HORIZONTAL" | "VERTICAL";
    gap: number;
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
    primaryAxisAlign: string;
    counterAxisAlign: string;
  };
  fill?: string;
  stroke?: string;
  cornerRadius?: number;
  effects?: string[];
  text?: {
    chars: string;
    fontSize: number;
    fontWeight: string | number;
    textStyle?: string;
    lines?: number;
  };
  componentRef?: { name: string; key?: string };
  boundTokens?: Record<string, string>;
  svg?: string;
  iconId?: string;
  iconHint?: string;
  children?: SerializedNode[];
  truncated?: boolean;
}

export interface SerializeResult {
  tree: SerializedNode;
  iconMap: Record<string, string>;
}

function minifySvg(svg: string): string {
  let s = svg;
  // Strip XML declaration and comments.
  s = s.replace(/<\?xml[^?]*\?>/g, "");
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  // Drop figma-specific/verbose attributes that have no rendering impact.
  s = s.replace(/\s(?:id|data-[a-zA-Z0-9_-]+|xmlns:[a-zA-Z]+)="[^"]*"/g, "");
  // Collapse whitespace.
  s = s.replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
  return s;
}

export interface IconExtractStats {
  totalIconNodes: number;
  uniqueIcons: number;
  totalBytes: number;
}

export function extractIcons(
  tree: SerializedNode
): { iconMap: Record<string, string>; stats: IconExtractStats } {
  const iconMap: Record<string, string> = {};
  const byContent = new Map<string, string>();
  let seq = 0;
  let totalIconNodes = 0;
  const walk = (n: SerializedNode) => {
    if (n.svg) {
      totalIconNodes += 1;
      const compact = minifySvg(n.svg);
      let id = byContent.get(compact);
      if (!id) {
        id = `ico_${seq++}`;
        byContent.set(compact, id);
        iconMap[id] = compact;
      }
      n.iconId = id;
      const dims = n.width && n.height ? `${n.width}x${n.height}` : "";
      n.iconHint = [n.name, dims].filter(Boolean).join(" ");
      delete n.svg;
    }
    if (n.children) n.children.forEach(walk);
  };
  walk(tree);
  let totalBytes = 0;
  for (const v of Object.values(iconMap)) totalBytes += v.length;
  return {
    iconMap,
    stats: { totalIconNodes, uniqueIcons: Object.keys(iconMap).length, totalBytes }
  };
}

const MAX_DEPTH = 10;
const MAX_CHILDREN = 40;
const MAX_SVG_CHARS = 4000;
const ICON_MAX_DIM = 64;

const VECTOR_PRIMITIVE_TYPES = new Set([
  "VECTOR",
  "BOOLEAN_OPERATION",
  "STAR",
  "POLYGON",
  "LINE",
  "ELLIPSE"
]);

function isVectorPrimitive(type: string): boolean {
  return VECTOR_PRIMITIVE_TYPES.has(type);
}

function hasGradientStroke(node: SceneNode): boolean {
  if (!("strokes" in node)) return false;
  const strokes = (node as GeometryMixin).strokes;
  if (!Array.isArray(strokes)) return false;
  return strokes.some(
    (s) => s.visible !== false && typeof s.type === "string" && s.type.startsWith("GRADIENT")
  );
}

function isIconCandidate(node: SceneNode): boolean {
  if (isVectorPrimitive(node.type)) return true;
  if (hasGradientStroke(node)) return true;
  if (
    (node.type === "FRAME" || node.type === "GROUP") &&
    "width" in node &&
    "height" in node
  ) {
    const w = (node as LayoutMixin).width;
    const h = (node as LayoutMixin).height;
    if (w <= ICON_MAX_DIM && h <= ICON_MAX_DIM && "findOne" in node) {
      const hasVector = (node as FrameNode | GroupNode).findOne((n) =>
        isVectorPrimitive(n.type)
      );
      if (hasVector) return true;
    }
  }
  return false;
}

async function tryExportSvg(node: SceneNode): Promise<string | undefined> {
  if (!("exportAsync" in node)) return undefined;
  try {
    const svg = await (node as unknown as {
      exportAsync(settings: { format: "SVG_STRING" }): Promise<string>;
    }).exportAsync({ format: "SVG_STRING" });
    if (!svg) return undefined;
    const compact = svg.replace(/\s+/g, " ").trim();
    if (compact.length > MAX_SVG_CHARS) return undefined;
    return compact;
  } catch {
    return undefined;
  }
}

function hex(r: number, g: number, b: number): string {
  const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function describePaint(paint: Paint): string {
  if (paint.type === "SOLID") {
    const { r, g, b } = paint.color;
    const opacity = paint.opacity ?? 1;
    const baseHex = hex(r, g, b);
    return opacity < 1 ? `${baseHex} @ ${Math.round(opacity * 100)}%` : baseHex;
  }
  if (paint.type.startsWith("GRADIENT")) {
    const g = paint as GradientPaint;
    const stops = (g.gradientStops ?? [])
      .map((s) => {
        const color = hex(s.color.r, s.color.g, s.color.b);
        const alpha = Math.round((s.color.a ?? 1) * 100);
        const pos = Math.round(s.position * 100);
        return alpha < 100 ? `${color}@${alpha}% ${pos}%` : `${color} ${pos}%`;
      })
      .join(", ");
    const handles = g.gradientTransform
      ? ` transform=[${g.gradientTransform
          .map((row) => row.map((n) => Number(n.toFixed(3))).join(","))
          .join("|")}]`
      : "";
    return `${paint.type.toLowerCase()}(${stops})${handles}`;
  }
  if (paint.type === "IMAGE") return "image";
  return paint.type.toLowerCase();
}

function describeFills(node: SceneNode): string | undefined {
  if (!("fills" in node)) return undefined;
  const fills = (node as GeometryMixin).fills;
  if (!Array.isArray(fills)) return undefined;
  const visible = fills.filter((f) => f.visible !== false);
  if (visible.length === 0) return undefined;
  return visible.map(describePaint).join(", ");
}

function describeStrokes(node: SceneNode): string | undefined {
  if (!("strokes" in node)) return undefined;
  const strokes = (node as GeometryMixin).strokes;
  if (!Array.isArray(strokes)) return undefined;
  const visible = strokes.filter((s) => s.visible !== false);
  if (visible.length === 0) return undefined;
  const weight = (node as unknown as { strokeWeight?: number | typeof figma.mixed }).strokeWeight;
  const w = typeof weight === "number" ? `${weight}px ` : "";
  return `${w}${visible.map(describePaint).join(", ")}`;
}

function describeEffects(node: SceneNode): string[] | undefined {
  if (!("effects" in node)) return undefined;
  const effects = (node as BlendMixin).effects;
  if (!Array.isArray(effects)) return undefined;
  const out: string[] = [];
  for (const e of effects) {
    if (e.visible === false) continue;
    if (e.type === "DROP_SHADOW" || e.type === "INNER_SHADOW") {
      const ds = e as DropShadowEffect | InnerShadowEffect;
      const color = hex(ds.color.r, ds.color.g, ds.color.b);
      const alpha = Math.round(ds.color.a * 100);
      out.push(
        `${e.type === "INNER_SHADOW" ? "inset " : ""}${ds.offset.x} ${ds.offset.y} ${ds.radius} ${color}@${alpha}%`
      );
    } else if (e.type === "LAYER_BLUR" || e.type === "BACKGROUND_BLUR") {
      out.push(`${e.type.toLowerCase()}(${e.radius})`);
    }
  }
  return out.length > 0 ? out : undefined;
}

function describeText(node: TextNode): SerializedNode["text"] {
  const chars = node.characters ?? "";
  const capped = chars.length > 120 ? chars.slice(0, 120) + "…" : chars;
  const fontSize = typeof node.fontSize === "number" ? node.fontSize : 0;
  const fontName = node.fontName;
  const weight =
    fontName !== figma.mixed && typeof fontName === "object" ? fontName.style : "mixed";
  const style =
    typeof node.textStyleId === "string" && node.textStyleId !== "" ? "linked" : undefined;
  // Infer rendered line count from height + lineHeight so the downstream converter
  // knows when text is meant to wrap (e.g. multi-line subtitle in a fixed-width block).
  let lines: number | undefined;
  const height = typeof node.height === "number" ? node.height : 0;
  if (fontSize > 0 && height > 0) {
    const lh = node.lineHeight;
    let lineHeightPx: number;
    if (lh && typeof lh === "object" && "unit" in lh) {
      if (lh.unit === "PIXELS" && typeof lh.value === "number") lineHeightPx = lh.value;
      else if (lh.unit === "PERCENT" && typeof lh.value === "number")
        lineHeightPx = (lh.value / 100) * fontSize;
      else lineHeightPx = fontSize * 1.25; // AUTO fallback
    } else {
      lineHeightPx = fontSize * 1.25;
    }
    const estimated = Math.max(1, Math.round(height / lineHeightPx));
    if (estimated >= 2) lines = estimated;
  }
  return { chars: capped, fontSize, fontWeight: weight, textStyle: style, lines };
}

function describeCornerRadius(node: SceneNode): number | undefined {
  const radius = (node as unknown as { cornerRadius?: number | typeof figma.mixed }).cornerRadius;
  if (typeof radius === "number" && radius > 0) return radius;
  return undefined;
}

function describeBoundTokens(node: SceneNode): Record<string, string> | undefined {
  const bound = (node as unknown as {
    boundVariables?: Record<string, { id: string } | { id: string }[]>;
  }).boundVariables;
  if (!bound) return undefined;
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(bound)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (!first) continue;
    try {
      const variable = figma.variables.getVariableById(first.id);
      if (variable) out[key] = variable.name;
    } catch {
      // ignore
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

async function describeComponentRef(
  node: SceneNode
): Promise<SerializedNode["componentRef"]> {
  if (node.type !== "INSTANCE") return undefined;
  const instance = node as InstanceNode;
  // documentAccess: "dynamic-page" 모드에서는 동기 mainComponent 접근 금지.
  const main = await instance.getMainComponentAsync();
  if (!main) return undefined;
  const parent = main.parent;
  const name = parent && parent.type === "COMPONENT_SET" ? parent.name : main.name;
  const key =
    parent && parent.type === "COMPONENT_SET" ? (parent as ComponentSetNode).key : main.key;
  return { name, key: key || undefined };
}

export async function serializeNode(
  node: SceneNode,
  depth = 0,
  parentLayoutMode?: string,
  parentName?: string
): Promise<SerializedNode> {
  const result: SerializedNode = {
    id: node.id,
    type: node.type,
    name: node.name
  };

  if ("width" in node && "height" in node) {
    result.width = Math.round((node as LayoutMixin).width);
    result.height = Math.round((node as LayoutMixin).height);
  }
  const layoutPositioning = (node as unknown as { layoutPositioning?: string })
    .layoutPositioning;
  const isAbsolute =
    layoutPositioning === "ABSOLUTE" ||
    !parentLayoutMode ||
    parentLayoutMode === "NONE";
  if ((depth === 0 || isAbsolute) && "x" in node && "y" in node) {
    result.x = Math.round((node as LayoutMixin).x);
    result.y = Math.round((node as LayoutMixin).y);
    if (depth > 0 && isAbsolute) {
      result.absolute = true;
      if (parentName) result.anchorParent = parentName;
    }
  }
  const constraints = (node as unknown as {
    constraints?: { horizontal: string; vertical: string };
  }).constraints;
  if (constraints && isAbsolute && depth > 0) {
    result.constraints = {
      horizontal: constraints.horizontal,
      vertical: constraints.vertical
    };
  }

  if (node.type === "FRAME" || node.type === "COMPONENT" || node.type === "INSTANCE") {
    const frame = node as FrameNode;
    if (frame.layoutMode === "HORIZONTAL" || frame.layoutMode === "VERTICAL") {
      result.layout = {
        mode: frame.layoutMode,
        gap: frame.itemSpacing,
        paddingTop: frame.paddingTop,
        paddingBottom: frame.paddingBottom,
        paddingLeft: frame.paddingLeft,
        paddingRight: frame.paddingRight,
        primaryAxisAlign: frame.primaryAxisAlignItems,
        counterAxisAlign: frame.counterAxisAlignItems
      };
    }
  }

  const fill = describeFills(node);
  if (fill) result.fill = fill;
  const stroke = describeStrokes(node);
  if (stroke) result.stroke = stroke;
  const radius = describeCornerRadius(node);
  if (radius !== undefined) result.cornerRadius = radius;
  const effects = describeEffects(node);
  if (effects) result.effects = effects;
  const tokens = describeBoundTokens(node);
  if (tokens) result.boundTokens = tokens;

  if (node.type === "TEXT") {
    result.text = describeText(node as TextNode);
  }

  const componentRef = await describeComponentRef(node);
  if (componentRef) result.componentRef = componentRef;

  if (node.type === "COMPONENT_SET") {
    return result;
  }

  if (isIconCandidate(node)) {
    const svg = await tryExportSvg(node);
    if (svg) {
      result.svg = svg;
      return result;
    }
  }

  if (depth >= MAX_DEPTH) {
    result.truncated = true;
    return result;
  }

  if ("children" in node) {
    const children = (node as ChildrenMixin).children as readonly SceneNode[];
    const visible = children.filter((c) => c.visible !== false);
    if (visible.length > 0) {
      const ownLayoutMode =
        (node as unknown as { layoutMode?: string }).layoutMode ?? "NONE";
      const serialized: SerializedNode[] = [];
      for (const c of visible.slice(0, MAX_CHILDREN)) {
        serialized.push(await serializeNode(c, depth + 1, ownLayoutMode, node.name));
      }
      if (visible.length > MAX_CHILDREN) {
        serialized.push({
          id: "__truncated__",
          type: "META",
          name: `... ${visible.length - MAX_CHILDREN}개 자식 생략`
        });
      }
      result.children = serialized;
    }
  }

  return result;
}
