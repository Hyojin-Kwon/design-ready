import data from "./ldsTokens.json";

export interface TokenAlias {
  alias: string;
}

export type TokenValue = string | number | boolean | TokenAlias;

export interface ColorToken {
  name: string;
  collection: string;
  library?: string;
  modes: Record<string, string | TokenAlias>;
}

export interface NumberToken {
  name: string;
  collection: string;
  library?: string;
  modes: Record<string, number | TokenAlias>;
}

export interface StringToken {
  name: string;
  collection: string;
  library?: string;
  modes: Record<string, string | TokenAlias>;
}

export interface BooleanToken {
  name: string;
  collection: string;
  library?: string;
  modes: Record<string, boolean | TokenAlias>;
}

export interface TextStyleToken {
  name: string;
  fontFamily: string;
  fontStyle: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: { unit: "PIXELS" | "PERCENT" | "AUTO"; value?: number };
  letterSpacing?: { unit: "PIXELS" | "PERCENT"; value: number };
  textDecoration?: string;
  textCase?: string;
  source: "local" | "remote";
}

export interface LdsTokens {
  version: string;
  updatedAt: string;
  colors: ColorToken[];
  numbers: NumberToken[];
  strings?: StringToken[];
  booleans?: BooleanToken[];
  textStyles: TextStyleToken[];
}

export const BUILTIN_TOKENS: LdsTokens = data as LdsTokens;
