import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ja" | "en";

const I18nContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "ja",
  setLang: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ja");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    if (stored === "ja" || stored === "en") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  return <I18nContext.Provider value={{ lang, setLang }}>{children}</I18nContext.Provider>;
}

export function useLang() {
  return useContext(I18nContext);
}

export function t<T extends { ja: string; en: string }>(obj: T, lang: Lang): string {
  return obj[lang];
}

export const STRINGS = {
  brand: { ja: "ARTIST", en: "ARTIST" },
  menu: {
    news: { ja: "ニュース", en: "NEWS" },
    appearances: { ja: "出演情報", en: "APPEARANCES" },
    choreography: { ja: "振付作品", en: "CHOREOGRAPHY" },
    biography: { ja: "プロフィール", en: "BIOGRAPHY" },
    record: { ja: "リリース", en: "RECORD" },
    contact: { ja: "お問い合わせ", en: "CONTACT" },
    login: { ja: "ログイン", en: "LOGIN" },
    admin: { ja: "管理画面", en: "ADMIN" },
    logout: { ja: "ログアウト", en: "LOGOUT" },
  },
  explore: { ja: "詳しく見る", en: "EXPLORE" },
  noContent: { ja: "まだコンテンツがありません。", en: "No content yet." },
};
