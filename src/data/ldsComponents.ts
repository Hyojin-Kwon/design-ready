import data from "./ldsComponents.json";

export interface LdsFigmaComponent {
  name: string;
  key: string;
}

export type LdsFigmaComponentEntry = string | LdsFigmaComponent;

export interface LdsData {
  version: string;
  updatedAt: string;
  source?: string;
  components: string[];
  subPatterns?: string[];
  variants?: {
    color?: string[];
    size?: string[];
    background?: string[];
    state?: string[];
  };
  rules?: string[];
  figmaComponents?: LdsFigmaComponentEntry[];
  figmaExtractedAt?: string;
}

export function getFigmaComponentName(entry: LdsFigmaComponentEntry): string {
  return typeof entry === "string" ? entry : entry.name;
}

export function getFigmaComponentKey(entry: LdsFigmaComponentEntry): string | null {
  if (typeof entry === "string") return null;
  return entry.key || null;
}

export const BUILTIN_LDS: LdsData = data as LdsData;
