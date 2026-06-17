import type { CodeReadinessReport, ReadinessMetric, ReadinessMetricId } from "../types";
import {
  hasComponentNamedAncestor,
  isDefaultName,
  looksLikeComponentNaming,
} from "../rules/namingRules";
import {
  getGroupDepth,
  isComponentInternal,
  isInsideHidden,
  isInsideIcon,
  walk,
} from "../utils/nodeTraversal";

const ICON_SHAPE_TYPES: ReadonlyArray<SceneNode["type"]> = [
  "RECTANGLE",
  "ELLIPSE",
  "STAR",
  "POLYGON",
  "LINE",
];

interface Counters {
  total: number;
  namedSemantically: number;
  frameCandidates: number;
  framesWithAutoLayout: number;
  componentLikeTotal: number;
  componentLikeBound: number;
  fillable: number;
  fillableTokenBound: number;
  groupsShallow: number;
  groupsTotal: number;
}

function empty(): Counters {
  return {
    total: 0,
    namedSemantically: 0,
    frameCandidates: 0,
    framesWithAutoLayout: 0,
    componentLikeTotal: 0,
    componentLikeBound: 0,
    fillable: 0,
    fillableTokenBound: 0,
    groupsShallow: 0,
    groupsTotal: 0,
  };
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

function hasFillStyle(node: SceneNode): boolean {
  if (!("fillStyleId" in node)) return false;
  const id = (node as unknown as { fillStyleId: string | typeof figma.mixed }).fillStyleId;
  return id !== "" && id !== figma.mixed;
}

function count(root: BaseNode): Counters {
  const c = empty();
  walk(root, (node) => {
    if (isComponentInternal(node)) return;
    if (node.visible === false || isInsideHidden(node)) return;
    if (ICON_SHAPE_TYPES.includes(node.type) && isInsideIcon(node)) return;
    if ((node.type === "VECTOR" || node.type === "BOOLEAN_OPERATION") && isInsideIcon(node)) return;
    c.total += 1;

    if (!isDefaultName(node.name)) c.namedSemantically += 1;

    if (node.type === "FRAME") {
      const frame = node as FrameNode;
      if (frame.children.length >= 2) {
        c.frameCandidates += 1;
        if (frame.layoutMode !== "NONE") c.framesWithAutoLayout += 1;
      }
    }

    const isInstance = node.type === "INSTANCE";
    const looksDetached =
      node.type === "FRAME" &&
      (node as FrameNode).children.length > 0 &&
      looksLikeComponentNaming(node.name);
    const isTopLevelComponentLike =
      (isInstance || looksDetached) && !hasComponentNamedAncestor(node);
    if (isTopLevelComponentLike) {
      c.componentLikeTotal += 1;
      if (isInstance) c.componentLikeBound += 1;
    }

    if (node.type === "TEXT") {
      c.fillable += 1;
      const text = node as TextNode;
      if ((text.textStyleId && text.textStyleId !== "") || hasBoundColorVariable(node)) {
        c.fillableTokenBound += 1;
      }
    } else if (
      node.type !== "VECTOR" &&
      node.type !== "BOOLEAN_OPERATION" &&
      !(ICON_SHAPE_TYPES.includes(node.type) && isInsideIcon(node)) &&
      hasVisibleSolidFill(node)
    ) {
      c.fillable += 1;
      if (hasFillStyle(node) || hasBoundColorVariable(node)) {
        c.fillableTokenBound += 1;
      }
    }

    if (node.type === "GROUP") {
      c.groupsTotal += 1;
      if (getGroupDepth(node) < 3) c.groupsShallow += 1;
    }
  });
  return c;
}

function ratio(
  numerator: number,
  denominator: number,
): { score: number; passing: number; sample: number } {
  if (denominator <= 0) return { score: 100, passing: 0, sample: 0 };
  return {
    score: Math.round((numerator / denominator) * 100),
    passing: numerator,
    sample: denominator,
  };
}

interface MetricConfig {
  id: ReadinessMetricId;
  label: string;
  weight: number;
  computeHint: (metric: ReturnType<typeof ratio>) => string;
}

// 가중치 기준(2026 모델 시대 잠정 v2): "모델이 추론으로 복구 가능한가, 영구 소실인가".
// 디태치/토큰 해제는 비가역 손실이라 상향, 네이밍/깊이는 모델이 상당 부분 복구하므로 하향.
// 항목별 실측 캘리브레이션(정제 전/후 동일 MCP 비교) 후 확정 예정.
// 가중치 내림차순 = "먼저 고칠 것" 우선순위 순.
const CONFIGS: MetricConfig[] = [
  {
    id: "component-binding",
    label: "컴포넌트 인스턴스 유지율",
    weight: 30,
    computeHint: (m) =>
      m.sample - m.passing > 0
        ? `디태치된 ${m.sample - m.passing}개 노드를 LDS 컴포넌트에 다시 연결해주세요.`
        : m.sample === 0
          ? "컴포넌트 유형 노드가 감지되지 않았습니다."
          : "모든 컴포넌트 인스턴스가 바인딩되어 있습니다.",
  },
  {
    id: "token-linkage",
    label: "스타일 토큰 연결률",
    weight: 25,
    computeHint: (m) =>
      m.sample - m.passing > 0
        ? `${m.sample - m.passing}개 노드를 로컬 값 대신 LDS 컬러/텍스트 토큰에 연결해주세요.`
        : m.sample === 0
          ? "범위 내 스타일 대상 노드가 없습니다."
          : "모든 스타일 노드가 토큰을 사용합니다.",
  },
  {
    id: "semantic-naming",
    label: "시맨틱 네이밍 비율",
    weight: 20,
    computeHint: (m) =>
      m.sample - m.passing > 0
        ? `디폴트 이름인 ${m.sample - m.passing}개 노드를 시맨틱하게 바꾸면 MCP 매핑이 좋아집니다.`
        : "모든 노드가 시맨틱한 이름을 가지고 있습니다.",
  },
  {
    id: "auto-layout",
    label: "오토레이아웃 적용률",
    weight: 20,
    computeHint: (m) =>
      m.sample - m.passing > 0
        ? `${m.sample - m.passing}개 프레임에 오토레이아웃을 적용하면 flexbox로 변환됩니다.`
        : m.sample === 0
          ? "범위 내 다자식 프레임이 없습니다."
          : "모든 다자식 프레임이 오토레이아웃을 사용합니다.",
  },
  {
    id: "structure-depth",
    label: "구조 깊이 적정성",
    weight: 5,
    computeHint: (m) =>
      m.sample - m.passing > 0
        ? `깊게 중첩된 ${m.sample - m.passing}개 그룹을 평탄화해주세요.`
        : "과도하게 중첩된 그룹이 없습니다.",
  },
];

export function computeCodeReadiness(root: BaseNode): CodeReadinessReport {
  const c = count(root);

  const ratios: Record<ReadinessMetricId, ReturnType<typeof ratio>> = {
    "semantic-naming": ratio(c.namedSemantically, c.total),
    "auto-layout": ratio(c.framesWithAutoLayout, c.frameCandidates),
    "component-binding": ratio(c.componentLikeBound, c.componentLikeTotal),
    "token-linkage": ratio(c.fillableTokenBound, c.fillable),
    "structure-depth": c.groupsTotal === 0 ? ratio(1, 1) : ratio(c.groupsShallow, c.groupsTotal),
  };

  const metrics: ReadinessMetric[] = CONFIGS.map((config) => {
    const r = ratios[config.id];
    const uplift = Math.round(((100 - r.score) * config.weight) / 100);
    return {
      id: config.id,
      label: config.label,
      weight: config.weight,
      score: r.score,
      sampleSize: r.sample,
      passing: r.passing,
      hint: config.computeHint(r),
      upliftIfFixed: uplift,
    };
  });

  const totalWeight = metrics.reduce((sum, m) => sum + m.weight, 0);
  const weighted = metrics.reduce((sum, m) => sum + m.score * m.weight, 0);
  const score = Math.round(weighted / totalWeight);

  return { score, metrics };
}
