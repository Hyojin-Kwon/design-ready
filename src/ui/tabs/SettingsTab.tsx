import { useRef, useState } from "preact/hooks";
import type { PluginSettings } from "../../types";
import {
  BUILTIN_LDS,
  getFigmaComponentKey,
  getFigmaComponentName,
  type LdsFigmaComponent
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
}

// AI 네이밍 추론 기능은 잘못된 LDS 매칭을 유발해 일시 비활성화.
// 코드는 보존 — 테스트 후 영구삭제 여부 결정. true로 바꾸면 UI 복구됨.
const SHOW_AI_UI = false;

const MODELS = [
  { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5 (빠름·저렴)" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6 (정확도 높음)" },
  { id: "claude-opus-4-7", label: "Claude Opus 4.7 (최고 정확도·느림)" }
];

const LDS_PLACEHOLDER = `예시 — 마크다운/리스트 형식 모두 가능

## Components
- Header: 최상단 내비게이션 바. 변형: Default, Transparent, Search
- BottomNavigation: 하단 탭바 (3~5 items)
- Button: Primary, Secondary, Tertiary, Ghost
- ListItem: Single, WithThumbnail, WithMeta
- Card, Chip, Badge, Avatar, Divider, Modal, BottomSheet, Toast

## Naming
- 슬래시 계층: Header/BackButton, Card/Thumbnail
- 상태: /Selected, /Disabled
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
    updatedCount: updated
  };
}

function formatExtractedJson(lib: ExtractedLibrary): string {
  const { list } = mergeFigmaComponents(lib);
  const merged = {
    ...BUILTIN_LDS,
    figmaComponents: list,
    figmaExtractedAt: lib.extractedAt
  };
  return JSON.stringify(merged, null, 2);
}

export function SettingsTab({
  settings,
  onSave,
  savedMark,
  extractedLibrary,
  onExtract,
  extracting
}: Props) {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);
  const [aiEnabled, setAiEnabled] = useState(settings.aiEnabled);
  const [ldsReference, setLdsReference] = useState(settings.ldsReference ?? "");
  const [systemPrompt, setSystemPrompt] = useState(settings.systemPrompt ?? "");
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
    setCopyMark(copied ? "복사됨" : "Cmd+C로 복사해주세요");
    setTimeout(() => setCopyMark(""), 2500);
  };

  const save = () =>
    onSave({
      apiKey: apiKey.trim(),
      model,
      aiEnabled,
      ldsReference,
      systemPrompt: systemPrompt.trim() ? systemPrompt : undefined
    });

  const resetSystemPrompt = () => setSystemPrompt("");

  return (
    <div class="settings">
      {SHOW_AI_UI && (
        <>
          <div class="section-title">AI 시맨틱 추론</div>
          <p class="settings-desc">
            룰로 못 잡은 디폴트 네이밍 노드를 Claude API로 추론합니다. API 키는 이 기기에만
            저장됩니다.
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
            <span class="settings-label">모델</span>
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
            <span>AI 추론 기능 활성화</span>
          </label>

          <div class="section-title" style={{ marginTop: 16 }}>
            디자인 시스템 레퍼런스
          </div>
          <p class="settings-desc">
            LDS(또는 쓰는 디자인 시스템) 컴포넌트/네이밍 규칙을 붙여넣으면 AI가 이 이름에 맞춰
            제안합니다. 비워두면 일반 UI 컨벤션으로 동작합니다.
          </p>

          <label class="settings-field">
            <span class="settings-label">LDS 컴포넌트 · 규칙</span>
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
        Export Pack 시스템 프롬프트
      </div>
      <p class="settings-desc">
        Export Pack의 <code>PROMPT.md</code>에 포함되는 변환 규칙입니다. 비워두면 기본
        프롬프트가 사용됩니다. 프로젝트별 컨벤션이 있다면 여기서 덮어쓰세요.
      </p>

      <label class="settings-field">
        <span class="settings-label">시스템 프롬프트 (선택)</span>
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
          기본값으로 초기화
        </button>
      </div>

      <div class="settings-actions">
        <button
          class="btn primary"
          onClick={save}
          disabled={SHOW_AI_UI && apiKey.trim().length === 0}
        >
          저장
        </button>
        {savedMark && <span class="settings-saved">저장됨</span>}
      </div>

      {SHOW_AI_UI && (
        <p class="settings-note">
          키 발급: <code>https://console.anthropic.com/</code>
        </p>
      )}

      <div class="section-title" style={{ marginTop: 20 }}>
        개발자 모드: LDS Figma 추출
      </div>
      <p class="settings-desc">
        두 가지 모드 지원:
      </p>
      <p class="settings-desc" style={{ marginTop: 2 }}>
        <strong>A) LDS 원본 파일에서 실행</strong> — 퍼블리시(또는 Republish)된 상태에서
        모든 COMPONENT/COMPONENT_SET를 스캔해 전체 어휘 수집. 권장.
      </p>
      <p class="settings-desc" style={{ marginTop: 2 }}>
        <strong>B) LDS 인스턴스를 쓴 작업 파일에서 실행</strong> — 실제 쓰이는
        INSTANCE의 mainComponent에서 key 수집. 퍼블리시 권한 없어도 동작.
      </p>
      <p class="settings-desc" style={{ marginTop: 4 }}>
        결과는 <strong>기존 어휘에 자동 병합</strong>되어 출력됩니다. 여러 파일에서 차례로
        추출하면 커버리지가 누적됩니다.
      </p>

      <div class="settings-actions">
        <button class="btn" onClick={onExtract} disabled={extracting}>
          {extracting ? "추출 중..." : "현재 파일에서 LDS 컴포넌트 추출"}
        </button>
      </div>

      {extractedLibrary && (
        <>
          <p class="settings-desc" style={{ marginTop: 4 }}>
            <strong>{extractedLibrary.components.length}개</strong> 수집 · INSTANCE{" "}
            {extractedLibrary.instanceCount}개 + COMPONENT{" "}
            {extractedLibrary.componentCount}개 · 페이지 {extractedLibrary.pageCount}개
          </p>
          {(() => {
            const m = mergeFigmaComponents(extractedLibrary);
            return (
              <p class="settings-desc" style={{ marginTop: 2 }}>
                기존 <strong>{m.existingCount}</strong>개 + 이번 추가{" "}
                <strong>{m.addedCount}</strong>개
                {m.updatedCount > 0 ? ` (key 갱신 ${m.updatedCount}개)` : ""} → 병합 총{" "}
                <strong>{m.list.length}</strong>개
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
              클립보드 복사
            </button>
            {copyMark && <span class="settings-saved">{copyMark}</span>}
          </div>
          <p class="settings-note">
            버튼이 안 되면 textarea 클릭 → Cmd+A → Cmd+C로 복사해주세요.
          </p>
        </>
      )}
    </div>
  );
}
