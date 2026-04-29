import type { LdsTemplateCatalog } from "../../types";

interface Props {
  version: string;
  bundledLdsCatalog: LdsTemplateCatalog | null;
}

export function AboutTab({ version, bundledLdsCatalog }: Props) {
  return (
    <div class="about-pane">
      <div class="section-title">Design Ready</div>
      <p class="settings-desc">
        Figma 디자인을 코드 변환에 적합한 형태로 정리하고, LDS 라이브러리를 참조한 Export
        Pack을 생성합니다. 헬스체크 → 시맨틱 네이밍 → Export Pack을 거쳐 Codex/Claude 같은
        AI 코딩 도구에서 React로 변환할 수 있습니다.
      </p>
      <p class="settings-desc" style={{ marginTop: 4 }}>
        버전 <strong>{version}</strong>
      </p>

      <div class="section-title" style={{ marginTop: 20 }}>
        사용법
      </div>
      <p class="settings-desc">
        <strong>1. 진단</strong> — 파일 헬스체크. 디폴트 네이밍/레이아웃 이슈를 찾아 점수화.
      </p>
      <p class="settings-desc" style={{ marginTop: 2 }}>
        <strong>2. 수정</strong> — 진단 결과를 일괄 수정. 시맨틱 네이밍 제안 적용.
      </p>
      <p class="settings-desc" style={{ marginTop: 2 }}>
        <strong>3. Export Pack</strong> — 선택 화면을 코드 변환용 zip으로 추출. AI 코딩 도구에
        그대로 입력.
      </p>
      <p class="settings-desc" style={{ marginTop: 2 }}>
        <strong>4. 코딩 도구에 지시</strong> — Codex/Claude Code에 Export Pack을 넘긴 뒤,
        다음과 같이 요청합니다.
      </p>
      <pre
        class="settings-desc"
        style={{
          marginTop: 6,
          padding: "10px 12px",
          background: "var(--chip-bg)",
          borderRadius: 6,
          fontSize: 11,
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          color: "#555555"
        }}
      >
{`PROMPT.md를 먼저 읽고 규칙 (a)(b)(c)를 숙지해.
screens/<slug>/의 tree.json + meta.json 기반으로
React 단일 파일로 변환해줘.

(a) foundation/ 토큰 var(--...)만 사용 (리터럴 색/사이즈 금지)
(b) 라이브러리 컴포넌트만 사용 (새 컴포넌트 생성 금지)
(c) 텍스트는 tree.json 원본 verbatim 유지

확신 없는 결정은 추측 말고 질문해줘.`}
      </pre>
      <p class="settings-desc" style={{ marginTop: 6 }}>
        화면 변주(같은 구조에 도메인만 교체)나 베이스라인 확장 시에도 위 3가지 규칙은
        항상 명시하세요. AI가 룰을 흘리면 두 번째 턴에 "PROMPT.md의 (a)(b)(c) 다시
        체크"라고 환기시키면 도움 됩니다.
      </p>

      <div class="section-title" style={{ marginTop: 20 }}>
        LDS 매처
      </div>
      <p class="settings-desc">
        {bundledLdsCatalog ? (
          <>
            <strong>{bundledLdsCatalog.components.length}개</strong> LDS 컴포넌트가 매처에
            등록되어 있습니다 (출처: {bundledLdsCatalog.sourceFileName}).
          </>
        ) : (
          <span style={{ color: "var(--figma-color-text-secondary, #888)" }}>
            번들 카탈로그가 비어 있습니다. 메인테이너에게 문의하세요.
          </span>
        )}
      </p>
    </div>
  );
}
