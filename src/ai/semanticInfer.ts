import type { AiNodeContext, NamingSuggestion } from "../types";
import { BUILTIN_LDS, getFigmaComponentName } from "../data/ldsComponents";
import { isDefaultName } from "../rules/namingRules";
import { isComponentInternal, isInsideHidden, isInsideIcon, walk } from "../utils/nodeTraversal";

const PRIMITIVE_SHAPE_TYPES = new Set([
  "VECTOR",
  "BOOLEAN_OPERATION",
  "RECTANGLE",
  "ELLIPSE",
  "STAR",
  "POLYGON",
  "LINE"
]);

function buildContext(node: SceneNode): AiNodeContext {
  const ctx: AiNodeContext = {
    nodeId: node.id,
    currentName: node.name,
    type: node.type,
    childrenSummary: [],
    siblingNames: []
  };

  if ("width" in node && "height" in node) {
    ctx.width = Math.round(node.width);
    ctx.height = Math.round(node.height);
  }
  if ("x" in node && "y" in node) {
    ctx.x = Math.round(node.x);
    ctx.y = Math.round(node.y);
  }

  const parent = node.parent;
  if (parent && parent.type !== "PAGE" && parent.type !== "DOCUMENT") {
    ctx.parent = { name: parent.name, type: parent.type };
    if ("children" in parent) {
      const siblings = parent.children as readonly SceneNode[];
      ctx.siblingNames = siblings
        .filter((s) => s.id !== node.id)
        .slice(0, 4)
        .map((s) => `${s.name}:${s.type}`);
    }
  }

  if ("children" in node) {
    const children = node.children as readonly SceneNode[];
    ctx.childrenSummary = children.slice(0, 6).map((c) => `${c.name}:${c.type}`);
  }

  if (node.type === "TEXT") {
    const text = (node as TextNode).characters;
    if (typeof text === "string") {
      ctx.textPreview = text.length > 60 ? text.slice(0, 60) + "…" : text;
    }
  }

  return ctx;
}

export function collectAiCandidates(root: BaseNode, skipIds: Set<string>): AiNodeContext[] {
  const candidates: AiNodeContext[] = [];
  walk(root, (node) => {
    if (skipIds.has(node.id)) return;
    if (isComponentInternal(node)) return;
    if (node.visible === false || isInsideHidden(node)) return;
    if (PRIMITIVE_SHAPE_TYPES.has(node.type) && isInsideIcon(node)) return;
    if (!isDefaultName(node.name)) return;
    candidates.push(buildContext(node));
  });
  return candidates.slice(0, 60);
}

const BASE_PROMPT = `You are a UI/UX expert renaming Figma layers for design-to-code conversion.

For EVERY layer in the input, propose a semantic name. Even when unsure, make your best guess based on type, size, position, parent name, siblings.

Default naming style (used only when no design system reference below applies):
- PascalCase parts separated by "/" (e.g., Header/NavigationBar)
- Reflect PURPOSE and POSITION in the screen, not visual style
- When parent name is semantic, extend it
- Short: 1–3 segments, 4 max

When a design system reference is provided below, FOLLOW ITS NAMING STYLE EXACTLY — including its separators, casing, numeric prefixes, and variant suffixes. Do not re-case LDS names into PascalCase.

You MUST return a JSON array with one entry per input nodeId. No prose, no code fences. Schema:
[{ "nodeId": string, "suggestedName": string, "reason": string }]`;

const DEFAULT_VOCAB = `Common UI patterns if no design system reference is provided: Header, BottomNavigation, TabBar, Modal, BottomSheet, Card, CardList, List, ListItem, Thumbnail, Avatar, Title, Subtitle, Caption, Button, Icon, Divider, Badge, Chip, Container, Content, Section.`;

const MAX_FIGMA_SAMPLES = 250;

function summarizeFigmaComponents(components: string[]): string[] {
  const normalized = components
    .map((c) => c.trim().replace(/\s+/g, " "))
    .filter((c) => c.length > 0);

  const prefixesByDepth = new Set<string>();
  const fullPaths: string[] = [];

  for (const path of normalized) {
    const parts = path.split(/\s*\/\s*/).filter((p) => p.length > 0);
    if (parts.length === 0) continue;

    for (let depth = 1; depth <= Math.min(parts.length, 3); depth++) {
      const prefix = parts.slice(0, depth).join(" / ");
      prefixesByDepth.add(prefix);
    }
    if (parts.length >= 4) fullPaths.push(path);
  }

  const ordered = Array.from(prefixesByDepth).sort();
  if (ordered.length >= MAX_FIGMA_SAMPLES) return ordered.slice(0, MAX_FIGMA_SAMPLES);

  const result = [...ordered];
  const remaining = MAX_FIGMA_SAMPLES - result.length;
  if (remaining > 0 && fullPaths.length > 0) {
    const step = Math.max(1, Math.floor(fullPaths.length / remaining));
    for (let i = 0; i < fullPaths.length && result.length < MAX_FIGMA_SAMPLES; i += step) {
      result.push(fullPaths[i]);
    }
  }
  return result;
}

function buildLdsSection(): string | null {
  const parts: string[] = [];
  if (BUILTIN_LDS.components.length > 0) {
    parts.push(
      "Top-level components from naming doc (prefer these exact names, including numeric prefix):\n" +
        BUILTIN_LDS.components.map((n) => `- ${n}`).join("\n")
    );
  }
  if (BUILTIN_LDS.figmaComponents && BUILTIN_LDS.figmaComponents.length > 0) {
    const names = BUILTIN_LDS.figmaComponents.map(getFigmaComponentName);
    const sampled = summarizeFigmaComponents(names);
    parts.push(
      "Components present in the LDS Figma library (use these as vocabulary):\n" +
        sampled.map((n) => `- ${n}`).join("\n")
    );
  }
  if (BUILTIN_LDS.subPatterns && BUILTIN_LDS.subPatterns.length > 0) {
    parts.push(
      "Common sub-patterns (use ' / ' separator with spaces):\n" +
        BUILTIN_LDS.subPatterns.map((n) => `- ${n}`).join("\n")
    );
  }
  if (BUILTIN_LDS.variants) {
    const v = BUILTIN_LDS.variants;
    const lines: string[] = [];
    if (v.color?.length) lines.push(`- color: ${v.color.join(", ")}`);
    if (v.size?.length) lines.push(`- size: ${v.size.join(", ")}`);
    if (v.background?.length) lines.push(`- background: ${v.background.join(", ")}`);
    if (v.state?.length) lines.push(`- state: ${v.state.join(", ")}`);
    if (lines.length > 0) {
      parts.push("Variant modifiers:\n" + lines.join("\n"));
    }
  }
  if (BUILTIN_LDS.rules && BUILTIN_LDS.rules.length > 0) {
    parts.push("Style rules:\n" + BUILTIN_LDS.rules.map((r) => `- ${r}`).join("\n"));
  }
  if (parts.length === 0) return null;
  const header = BUILTIN_LDS.source
    ? `### Official LDS naming reference (authoritative — source: ${BUILTIN_LDS.source})`
    : "### Official LDS naming reference (authoritative)";
  return `${header}\n\n${parts.join("\n\n")}`;
}

function buildSystemPrompt(ldsReference: string, libraryComponents: string[]): string {
  const sections: string[] = [BASE_PROMPT];

  const ldsSection = buildLdsSection();
  if (ldsSection) sections.push(ldsSection);

  if (libraryComponents.length > 0) {
    sections.push(
      `### Components used in this file (supplementary vocabulary)\n\n${libraryComponents
        .map((n) => `- ${n}`)
        .join("\n")}`
    );
  }

  const trimmed = ldsReference.trim();
  if (trimmed) {
    sections.push(`### Additional user-provided reference\n\n${trimmed}`);
  }

  if (!ldsSection && libraryComponents.length === 0 && !trimmed) {
    sections.push(DEFAULT_VOCAB);
  }

  return sections.join("\n\n");
}

interface AnthropicResponse {
  content?: Array<{ type: string; text?: string }>;
  error?: { message: string };
}

const CHUNK_SIZE = 20;

async function callOnce(
  apiKey: string,
  model: string,
  ldsReference: string,
  libraryComponents: string[],
  contexts: AiNodeContext[]
): Promise<NamingSuggestion[]> {
  const userPrompt = `Rename these ${contexts.length} layers. Output a JSON array with exactly ${contexts.length} items (one per nodeId). JSON only, no prose.\n\n${JSON.stringify(contexts)}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: buildSystemPrompt(ldsReference, libraryComponents),
      messages: [{ role: "user", content: userPrompt }]
    })
  });

  const data = (await response.json()) as AnthropicResponse;
  if (!response.ok) {
    throw new Error(data.error?.message ?? `API ${response.status}`);
  }

  const text = data.content?.find((c) => c.type === "text")?.text ?? "";
  if (typeof console !== "undefined") {
    console.log("[DesignReady AI] raw response:", text);
  }
  return parseNamingJson(text, contexts);
}

export async function callAnthropic(
  apiKey: string,
  model: string,
  ldsReference: string,
  libraryComponents: string[],
  contexts: AiNodeContext[]
): Promise<NamingSuggestion[]> {
  if (contexts.length === 0) return [];
  const all: NamingSuggestion[] = [];
  for (let i = 0; i < contexts.length; i += CHUNK_SIZE) {
    const chunk = contexts.slice(i, i + CHUNK_SIZE);
    const part = await callOnce(apiKey, model, ldsReference, libraryComponents, chunk);
    all.push(...part);
  }
  return all;
}

function parseNamingJson(raw: string, contexts: AiNodeContext[]): NamingSuggestion[] {
  const jsonStart = raw.indexOf("[");
  const jsonEnd = raw.lastIndexOf("]");
  if (jsonStart < 0 || jsonEnd < 0) return [];
  let arr: Array<{ nodeId?: string; suggestedName?: string; reason?: string }>;
  try {
    arr = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
  } catch {
    return [];
  }

  const contextById = new Map(contexts.map((c) => [c.nodeId, c]));
  const suggestions: NamingSuggestion[] = [];
  for (const item of arr) {
    if (!item.nodeId || !item.suggestedName) continue;
    const ctx = contextById.get(item.nodeId);
    if (!ctx) continue;
    suggestions.push({
      nodeId: item.nodeId,
      nodeType: ctx.type,
      currentName: ctx.currentName,
      suggestedName: item.suggestedName,
      reason: `AI: ${item.reason ?? "컨텍스트 기반 추론"}`
    });
  }
  return suggestions;
}
