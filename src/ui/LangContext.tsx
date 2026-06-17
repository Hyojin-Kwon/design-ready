import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { translations, type T, type Lang } from "../i18n";

interface LangCtxValue {
  t: T;
  lang: Lang;
  toggle: () => void;
}

export const LangCtx = createContext<LangCtxValue>({
  t: translations.en,
  lang: "en",
  toggle: () => {},
});

export const useT = () => useContext(LangCtx).t;
export const useLang = () => useContext(LangCtx);
