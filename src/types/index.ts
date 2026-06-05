export type Severity = "critical" | "warning" | "info";

export type Category = "naming" | "layout" | "system" | "style" | "hygiene";

export interface Issue {
  id: string;
  nodeId: string;
  nodeName: string;
  nodeType: string;
  ruleId: string;
  title: string;
  description: string;
  severity: Severity;
  category: Category;
}

export interface CategoryScore {
  category: Category;
  passRate: number;
  issueCount: number;
  totalCount: number;
}

export interface HealthReport {
  score: number;
  totalNodes: number;
  issues: Issue[];
  categoryScores: CategoryScore[];
}

export interface NamingSuggestion {
  nodeId: string;
  nodeType: string;
  currentName: string;
  suggestedName: string;
  reason: string;
  ldsComponentKey?: string;
}

export interface ReplaceWithLdsResult {
  replaced: Array<{ nodeId: string; newNodeId: string }>;
  failed: Array<{ nodeId: string; error: string }>;
}

export type ReadinessMetricId =
  | "semantic-naming"
  | "auto-layout"
  | "component-binding"
  | "token-linkage"
  | "structure-depth";

export interface ReadinessMetric {
  id: ReadinessMetricId;
  label: string;
  weight: number;
  score: number;
  sampleSize: number;
  passing: number;
  hint: string;
  upliftIfFixed: number;
}

export interface CodeReadinessReport {
  score: number;
  metrics: ReadinessMetric[];
}

export interface ScanResult {
  health: HealthReport;
  suggestions: NamingSuggestion[];
  readiness: CodeReadinessReport;
  scanRoot: string;
}

export interface ApplyNamingItem {
  nodeId: string;
  suggestedName: string;
}

export interface ApplyNamingResult {
  applied: string[];
  failed: Array<{ nodeId: string; error: string }>;
}

export interface DeleteNodesResult {
  deleted: string[];
  failed: Array<{ nodeId: string; error: string }>;
}

export type AutofixRuleId =
  | "subpixel-position"
  | "subpixel-size"
  | "subpixel-spacing"
  | "single-child-group"
  | "single-child-frame-wrapper"
  | "deep-group-nesting"
  | "empty-frame"
  | "missing-auto-layout";

export const AUTOFIX_RULE_IDS: ReadonlySet<string> = new Set<AutofixRuleId>([
  "subpixel-position",
  "subpixel-size",
  "subpixel-spacing",
  "single-child-group",
  "single-child-frame-wrapper",
  "deep-group-nesting",
  "empty-frame",
  "missing-auto-layout"
]);

export interface AutofixItem {
  issueId: string;
  nodeId: string;
  ruleId: string;
}

export interface AutofixResult {
  fixed: string[];
  failed: Array<{ issueId: string; error: string }>;
}

export interface PluginSettings {
  apiKey: string;
  model: string;
  aiEnabled: boolean;
  ldsReference: string;
  systemPrompt?: string;
  libraryImportPath?: string;
}

export interface ExportScreenPayload {
  rootLabel: string;
  tree: import("../ai/conversionSerialize").SerializedNode;
  iconMap: Record<string, string>;
  healthReport?: string;
  semanticMap?: Array<{ nodeId: string; originalName: string; suggestedName: string }>;
}

export interface LdsTemplateCatalogEntry {
  name: string;
  key: string;
  // COMPONENT_SET의 경우 variant property 정의. variant를 가진 세트만 포함.
  // 예: { "Style": ["Primary", "Secondary"], "Size": ["S", "M", "L"] }
  variantProperties?: Record<string, string[]>;
}

export interface LdsTemplateCatalog {
  components: LdsTemplateCatalogEntry[];
  sourceFileName: string;
  extractedAt: string;
}

export interface NameOverride {
  nodeId: string;
  originalName: string;
  suggestedName: string;
}

export interface ExportFlowLink {
  from: { screen: string; nodeId: string; nodeName: string };
  to: { screen: string };
  trigger: string;
  action: string;
}

export interface ExportOptStats {
  beforeNodes: number;
  afterNodes: number;
  flattenedGroups: number;
  flattenedFrames: number;
  inferredLayouts: number;
  collapsedRepeats: number;
  totalIconNodes: number;
  uniqueIcons: number;
  iconBytes: number;
}

export interface ExportPayload {
  projectName: string;
  screens: ExportScreenPayload[];
  libraryComponents: string[];
  flow: ExportFlowLink[];
  optStats?: ExportOptStats;
}

export interface AiNodeContext {
  nodeId: string;
  currentName: string;
  type: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  parent?: { name: string; type: string };
  childrenSummary: string[];
  siblingNames: string[];
  textPreview?: string;
}

export type PluginMessage =
  | { type: "scan:start" }
  | { type: "scan:result"; result: ScanResult }
  | { type: "scan:error"; message: string }
  | { type: "select:node"; nodeId: string; hint?: string }
  | { type: "apply:naming"; items: ApplyNamingItem[] }
  | { type: "apply:naming:result"; result: ApplyNamingResult }
  | { type: "delete:nodes"; nodeIds: string[] }
  | { type: "delete:nodes:result"; result: DeleteNodesResult }
  | { type: "settings:get" }
  | { type: "settings:loaded"; settings: PluginSettings }
  | { type: "settings:save"; settings: PluginSettings }
  | { type: "settings:saved" }
  | {
      type: "ai:collect";
      existingSuggestionIds: string[];
      // 지정되면 해당 노드만 대상 (룰 필터 건너뜀). 미지정이면 전체 스캔 루트에서 디폴트 네이밍 수집.
      targetNodeIds?: string[];
    }
  | {
      type: "ai:collected";
      contexts: AiNodeContext[];
      libraryComponents: string[];
    }
  | { type: "library:extract" }
  | {
      type: "library:extracted";
      payload: {
        components: Array<{ name: string; key: string }>;
        extractedAt: string;
        pageCount: number;
        instanceCount: number;
        componentCount: number;
      };
    }
  | { type: "lds-template:extract" }
  | { type: "lds-template:extracted"; catalog: LdsTemplateCatalog; download?: boolean }
  | { type: "lds-template:get" }
  | {
      type: "lds-template:loaded";
      bundledCatalog: LdsTemplateCatalog | null;
      overrideCatalog: LdsTemplateCatalog | null;
    }
  | { type: "lds-template:clear" }
  | { type: "lds-template:cleared" }
  | { type: "replace:lds"; items: Array<{ nodeId: string; componentKey: string }> }
  | { type: "replace:lds:result"; result: ReplaceWithLdsResult }
  | { type: "autofix:apply"; items: AutofixItem[] }
  | { type: "autofix:result"; result: AutofixResult }
  | { type: "export:start"; overrides?: NameOverride[] }
  | { type: "export:prepared"; payload: ExportPayload }
  | { type: "export:error"; message: string }
  | { type: "ready" };
