import type { LdsTemplateCatalog } from "../../types";
import { useT } from "../LangContext";

interface Props {
  version: string;
  bundledLdsCatalog: LdsTemplateCatalog | null;
}

export function AboutTab({ version, bundledLdsCatalog }: Props) {
  const t = useT();

  const STEPS = [
    { title: t.aboutStep1Title, desc: t.aboutStep1Desc },
    { title: t.aboutStep2Title, desc: t.aboutStep2Desc },
    { title: t.aboutStep3Title, desc: t.aboutStep3Desc },
    { title: t.aboutStep4Title, desc: t.aboutStep4Desc },
  ];

  return (
    <div class="about-pane">
      <section class="about-hero">
        <div class="about-hero-title">Design Ready</div>
        <p class="about-hero-desc">{t.aboutHeroDesc}</p>
        <div class="about-hero-meta">v{version}</div>
      </section>

      <section class="about-section">
        <div class="about-section-title">{t.aboutHowItWorks}</div>
        <ol class="about-steps">
          {STEPS.map((s, i) => (
            <li class="about-step" key={s.title}>
              <span class="about-step-num">{i + 1}</span>
              <div class="about-step-body">
                <div class="about-step-title">{s.title}</div>
                <div class="about-step-desc">{s.desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section class="about-section">
        <div class="about-section-title">{t.aboutExamplePrompt}</div>
        <pre class="about-codeblock">{t.aboutExamplePromptText}</pre>
        <p class="about-note">
          {t.aboutNudge} <code>"Re-check rules (a)(b)(c) in PROMPT.md"</code>.
        </p>
      </section>

      <footer class="about-footer">
        <div class="about-footer-row">
          <span class="about-footer-label">{t.aboutLdsMatcher}</span>
          <span class="about-footer-value">
            {bundledLdsCatalog ? `${bundledLdsCatalog.components.length} components` : t.aboutEmpty}
          </span>
        </div>
        {bundledLdsCatalog && (
          <div class="about-footer-row">
            <span class="about-footer-label">{t.aboutSource}</span>
            <span class="about-footer-value">{bundledLdsCatalog.sourceFileName}</span>
          </div>
        )}
      </footer>
    </div>
  );
}
