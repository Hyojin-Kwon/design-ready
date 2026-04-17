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

export interface PluginSettings {
  apiKey: string;
  model: string;
  aiEnabled: boolean;
  ldsReference: string;
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
  | { type: "select:node"; nodeId: string }
  | { type: "apply:naming"; items: ApplyNamingItem[] }
  | { type: "apply:naming:result"; result: ApplyNamingResult }
  | { type: "delete:nodes"; nodeIds: string[] }
  | { type: "delete:nodes:result"; result: DeleteNodesResult }
  | { type: "settings:get" }
  | { type: "settings:loaded"; settings: PluginSettings }
  | { type: "settings:save"; settings: PluginSettings }
  | { type: "settings:saved" }
  | { type: "ai:collect"; existingSuggestionIds: string[] }
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
  | { type: "replace:lds"; items: Array<{ nodeId: string; componentKey: string }> }
  | { type: "replace:lds:result"; result: ReplaceWithLdsResult }
  | { type: "ready" };
