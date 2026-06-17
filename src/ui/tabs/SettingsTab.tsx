import { useRef, useState } from "preact/hooks";
import type { LdsTemplateCatalog, PluginSettings } from "../../types";
import {
  BUILTIN_LDS,
  getFigmaComponentKey,
  getFigmaComponentName,
  type LdsFigmaComponent,
} from "../../data/ldsComponents";
import { DEFAULT_SYSTEM_PROMPT } from "../../export/systemPrompt";

interface ExtractedLibrary {
  components: Array<{ name: string; key: string }>;
  extractedAt: string;
  pageCount: number;
  instanceCount: number;
  componentCount: number;
}

interface Props {
  settings: PluginSettings;
  onSave: (settings: PluginSettings) => void;
  savedMark: boolean;
  extractedLibrary: ExtractedLibrary | null;
  onExtract: () => void;
  extracting: boolean;
  bundledLdsCatalog: LdsTemplateCatalog | null;
  overrideLdsCatalog: LdsTemplateCatalog | null;
  onExtractLdsTemplate: () => void;
  onClearLdsTemplate: () => void;
  ldsTemplateExtracting: boolean;
}

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diff = Date.now() - then;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

// AI 네이밍 추론 기능은 잘못된 LDS 매칭을 유발해 일시 비활성화.
// 코드는 보존 — 테스트 후 영구삭제 여부 결정. true로 바꾸면 UI 복구됨.
const SHOW_AI_UI = false;

const MODELS = [
  { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5 (fast · cheap)" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6 (high accuracy)" },
  { id: "claude-opus-4-7", label: "Claude Opus 4.7 (best accuracy · slow)" },
];

const LDS_PLACEHOLDER = `Example — markdown or list format both work

## Components
- Header: top navigation bar. Variants: Default, Transparent, Search
- BottomNavigation: bottom tab bar (3~5 items)
- Button: Primary, Secondary, Tertiary, Ghost
- ListItem: Single, WithThumbnail, WithMeta
- Card, Chip, Badge, Avatar, Divider, Modal, BottomSheet, Toast

## Naming
- Slash hierarchy: Header/BackButton, Card/Thumbnail
- States: /Selected, /Disabled
`;

function mergeFigmaComponents(lib: ExtractedLibrary): {
  list: LdsFigmaComponent[];
  existingCount: number;
  newCount: number;
  addedCount: number;
  updatedCount: number;
} {
  const byName = new Map<string, LdsFigmaComponent>();
  const existing = BUILTIN_LDS.figmaComponents ?? [];
  for (const entry of existing) {
    const name = getFigmaComponentName(entry);
    const key = getFigmaComponentKey(entry);
    if (key) byName.set(name, { name, key });
  }
  const existingCount = byName.size;

  let added = 0;
  let updated = 0;
  for (const e of lib.components) {
    const prev = byName.get(e.name);
    if (!prev) {
      added += 1;
      byName.set(e.name, { name: e.name, key: e.key });
    } else if (prev.key !== e.key) {
      updated += 1;
      byName.set(e.name, { name: e.name, key: e.key });
    }
  }

  const list = Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name));
  return {
    list,
    existingCount,
    newCount: lib.components.length,
    addedCount: added,
    updatedCount: updated,
  };
}

function formatExtractedJson(lib: ExtractedLibrary): string {
  const { list } = mergeFigmaComponents(lib);
  const merged = {
    ...BUILTIN_LDS,
    figmaComponents: list,
    figmaExtractedAt: lib.extractedAt,
  };
  return JSON.stringify(merged, null, 2);
}

export function SettingsTab({
  settings,
  onSave,
  savedMark,
  extractedLibrary,
  onExtract,
  extracting,
  bundledLdsCatalog,
  overrideLdsCatalog,
  onExtractLdsTemplate,
  onClearLdsTemplate,
  ldsTemplateExtracting,
}: Props) {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);
  const [aiEnabled, setAiEnabled] = useState(settings.aiEnabled);
  const [ldsReference, setLdsReference] = useState(settings.ldsReference ?? "");
  const [systemPrompt, setSystemPrompt] = useState(settings.systemPrompt ?? "");
  const [libraryImportPath, setLibraryImportPath] = useState(settings.libraryImportPath ?? "");
  const [copyMark, setCopyMark] = useState("");
  const jsonTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const copyJson = async () => {
    if (!extractedLibrary) return;
    const json = formatExtractedJson(extractedLibrary);
    const ta = jsonTextareaRef.current;
    if (ta) {
      ta.focus();
      ta.select();
    }
    let copied = false;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(json);
        copied = true;
      }
    } catch {
      copied = false;
    }
    if (!copied) {
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }
    }
    setCopyMark(copied ? "Copied" : "Press Cmd+C to copy");
    setTimeout(() => setCopyMark(""), 2500);
  };

  const save = () =>
    onSave({
      apiKey: apiKey.trim(),
      model,
      aiEnabled,
      ldsReference,
      systemPrompt: systemPrompt.trim() ? systemPrompt : undefined,
      libraryImportPath: libraryImportPath.trim() || undefined,
    });

  const resetSystemPrompt = () => setSystemPrompt("");

  return (
    <div class="settings">
      {SHOW_AI_UI && (
        <>
          <div class="section-title">AI semantic inference</div>
          <p class="settings-desc">
            Use the Claude API to infer names for default-named nodes the rule engine missed. The
            API key is stored only on this device.
          </p>

          <label class="settings-field">
            <span class="settings-label">Anthropic API Key</span>
            <input
              type="password"
              class="settings-input"
              placeholder="sk-ant-..."
              value={apiKey}
              onInput={(e) => setApiKey((e.target as HTMLInputElement).value)}
            />
          </label>

          <label class="settings-field">
            <span class="settings-label">Model</span>
            <select
              class="settings-input"
              value={model}
              onChange={(e) => setModel((e.target as HTMLSelectElement).value)}
            >
              {MODELS.map((m) => (
                <option value={m.id} key={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          <label class="settings-toggle">
            <input
              type="checkbox"
              checked={aiEnabled}
              onChange={(e) => setAiEnabled((e.target as HTMLInputElement).checked)}
            />
            <span>Enable AI inference</span>
          </label>

          <div class="section-title" style={{ marginTop: 16 }}>
            Design system reference
          </div>
          <p class="settings-desc">
            Paste your LDS (or whatever design system you use) components and naming rules. The AI
            will align its suggestions to those names. Leave empty to fall back to generic UI
            conventions.
          </p>

          <label class="settings-field">
            <span class="settings-label">LDS components · rules</span>
            <textarea
              class="settings-input settings-textarea"
              placeholder={LDS_PLACEHOLDER}
              rows={10}
              value={ldsReference}
              onInput={(e) => setLdsReference((e.target as HTMLTextAreaElement).value)}
            />
          </label>
        </>
      )}

      <div class="section-title" style={{ marginTop: 16 }}>
        React component import path
      </div>
      <p class="settings-desc">
        The React import package path for library components. When set, it's included in{" "}
        <code>PROMPT.md</code> so Codex generates accurate import statements.
      </p>
      <label class="settings-field">
        <span class="settings-label">Import path (optional)</span>
        <input
          type="text"
          class="settings-input"
          placeholder="e.g. @company/design-system"
          value={libraryImportPath}
          onInput={(e) => setLibraryImportPath((e.target as HTMLInputElement).value)}
        />
      </label>

      <div class="section-title" style={{ marginTop: 16 }}>
        Export Pack system prompt
      </div>
      <p class="settings-desc">
        Conversion rules included in the Export Pack's <code>PROMPT.md</code>. Leave empty to use
        the default prompt. Override here for project-specific conventions.
      </p>

      <label class="settings-field">
        <span class="settings-label">System prompt (optional)</span>
        <textarea
          class="settings-input settings-textarea"
          placeholder={DEFAULT_SYSTEM_PROMPT}
          rows={12}
          value={systemPrompt}
          onInput={(e) => setSystemPrompt((e.target as HTMLTextAreaElement).value)}
        />
      </label>
      <div class="settings-actions">
        <button class="btn" onClick={resetSystemPrompt} disabled={systemPrompt.length === 0}>
          Reset to default
        </button>
      </div>

      <div class="settings-actions">
        <button
          class="btn primary"
          onClick={save}
          disabled={SHOW_AI_UI && apiKey.trim().length === 0}
        >
          Save
        </button>
        {savedMark && <span class="settings-saved">Saved</span>}
      </div>

      {SHOW_AI_UI && (
        <p class="settings-note">
          Get a key: <code>https://console.anthropic.com/</code>
        </p>
      )}

      <div class="section-title" style={{ marginTop: 20 }}>
        LDS template catalog
      </div>
      <p class="settings-desc">
        The bundled catalog is inlined at plugin build time and applies to all users automatically.
        The local override is for testing without a build (stored only on this device).
      </p>
      <p class="settings-desc" style={{ marginTop: 6 }}>
        <strong>Bundled:</strong>{" "}
        {bundledLdsCatalog ? (
          <>
            {bundledLdsCatalog.sourceFileName} ·{" "}
            <strong>{bundledLdsCatalog.components.length}</strong> components · extracted{" "}
            {formatRelativeTime(bundledLdsCatalog.extractedAt)}
          </>
        ) : (
          <span style={{ color: "var(--figma-color-text-secondary, #888)" }}>
            None (maintainer extraction required)
          </span>
        )}
      </p>
      <p class="settings-desc" style={{ marginTop: 2 }}>
        <strong>Local override:</strong>{" "}
        {overrideLdsCatalog ? (
          <>
            {overrideLdsCatalog.sourceFileName} ·{" "}
            <strong>{overrideLdsCatalog.components.length}</strong> · extracted{" "}
            {formatRelativeTime(overrideLdsCatalog.extractedAt)}
          </>
        ) : (
          <span style={{ color: "var(--figma-color-text-secondary, #888)" }}>None</span>
        )}
      </p>
      <div class="settings-actions">
        <button class="btn" onClick={onExtractLdsTemplate} disabled={ldsTemplateExtracting}>
          {ldsTemplateExtracting ? "Extracting..." : "Extract from current file → Download JSON"}
        </button>
        <button
          class="btn"
          onClick={onClearLdsTemplate}
          disabled={ldsTemplateExtracting || !overrideLdsCatalog}
        >
          Clear local override
        </button>
      </div>
      <p class="settings-desc" style={{ marginTop: 4 }}>
        Maintainers: commit the extracted JSON to <code>src/data/ldsCatalog.bundled.json</code>
        and rebuild → it ships as the bundle in the next release.
      </p>

      <div class="section-title" style={{ marginTop: 20 }}>
        Developer mode: LDS Figma extract
      </div>
      <p class="settings-desc">Two modes supported:</p>
      <p class="settings-desc" style={{ marginTop: 2 }}>
        <strong>A) Run from the LDS source file</strong> — once published (or republished), scans
        every COMPONENT/COMPONENT_SET to collect the full vocabulary. Recommended.
      </p>
      <p class="settings-desc" style={{ marginTop: 2 }}>
        <strong>B) Run from a working file that uses LDS instances</strong> — collects keys from
        each INSTANCE's mainComponent. Works without publish permissions.
      </p>
      <p class="settings-desc" style={{ marginTop: 4 }}>
        Results are <strong>auto-merged with the existing vocabulary</strong>. Run across multiple
        files to accumulate coverage.
      </p>

      <div class="settings-actions">
        <button class="btn" onClick={onExtract} disabled={extracting}>
          {extracting ? "Extracting..." : "Extract LDS components from current file"}
        </button>
      </div>

      {extractedLibrary && (
        <>
          <p class="settings-desc" style={{ marginTop: 4 }}>
            <strong>{extractedLibrary.components.length}</strong> collected · INSTANCE{" "}
            {extractedLibrary.instanceCount} + COMPONENT {extractedLibrary.componentCount} ·{" "}
            {extractedLibrary.pageCount} pages
          </p>
          {(() => {
            const m = mergeFigmaComponents(extractedLibrary);
            return (
              <p class="settings-desc" style={{ marginTop: 2 }}>
                Existing <strong>{m.existingCount}</strong> + added <strong>{m.addedCount}</strong>
                {m.updatedCount > 0 ? ` (key updates ${m.updatedCount})` : ""} → merged total{" "}
                <strong>{m.list.length}</strong>
              </p>
            );
          })()}
          <label class="settings-field">
            <span class="settings-label">ldsComponents.json</span>
            <textarea
              ref={jsonTextareaRef}
              class="settings-input settings-textarea"
              rows={10}
              readOnly
              onFocus={(e) => (e.target as HTMLTextAreaElement).select()}
              value={formatExtractedJson(extractedLibrary)}
            />
          </label>
          <div class="settings-actions">
            <button class="btn primary" onClick={copyJson}>
              Copy to clipboard
            </button>
            {copyMark && <span class="settings-saved">{copyMark}</span>}
          </div>
          <p class="settings-note">
            If the button doesn't work, click the textarea → Cmd+A → Cmd+C to copy.
          </p>
        </>
      )}
    </div>
  );
}
