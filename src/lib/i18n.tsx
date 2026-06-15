import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ja" | "en" | "zh";

const I18nContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "ja",
  setLang: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ja");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    if (stored === "ja" || stored === "en" || stored === "zh") setLangState(stored);
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

/** Pick the localized field from a row: tries `${base}_${lang}` and falls back to ja → en → zh. */
export function pick(row: any, base: string, lang: Lang): string {
  if (!row) return "";
  return (
    row[`${base}_${lang}`] ||
    row[`${base}_ja`] ||
    row[`${base}_en`] ||
    row[`${base}_zh`] ||
    ""
  );
}

type L = { ja: string; en: string; zh: string };
export function t(obj: L, lang: Lang): string {
  return obj[lang] ?? obj.ja;
}

export const STRINGS = {
  brand: { ja: "KAZUTCHI", en: "KAZUTCHI", zh: "KAZUTCHI" },
  menu: {
    news: { ja: "ニュース", en: "NEWS", zh: "新闻" },
    choreography: { ja: "活動実績", en: "RECORD", zh: "活动记录" },
    biography: { ja: "プロフィール", en: "BIOGRAPHY", zh: "个人简介" },
    contact: { ja: "お問い合わせ", en: "CONTACT", zh: "联系" },
    login: { ja: "ログイン", en: "LOGIN", zh: "登录" },
    admin: { ja: "管理画面", en: "ADMIN", zh: "管理" },
    logout: { ja: "ログアウト", en: "LOGOUT", zh: "登出" },
    // 以下は残しておく（他で使う可能性があるため）
    appearances: { ja: "出演情報", en: "APPEARANCES", zh: "演出" },
    record: { ja: "リリース", en: "RELEASES", zh: "作品记录" },
  },
  explore: { ja: "詳しく見る", en: "EXPLORE", zh: "查看详情" },
  noContent: { ja: "まだコンテンツがありません。", en: "No content yet.", zh: "暂无内容。" },
  role: { ja: "プロダンサー / 振付師", en: "DANCER / CHOREOGRAPHER", zh: "专业舞者 / 编舞师" },
  heroTitle: {
    ja: "個性を活かし、\n観客の感情を動かす。",
    en: "Choreography that moves\nthe audience.",
    zh: "释放个性，\n打动观众。",
  },
  heroLead: {
    ja: "ジャズ・ポップス・アイドルグループのフォーメーションダンスを軸に活動するプロダンサー／振付師。",
    en: "Pro dancer and choreographer specializing in jazz, pop, and idol-group formation dance.",
    zh: "以爵士、流行及偶像团体队形舞为核心的专业舞者 / 编舞师。",
  },
  worksHeading: { ja: "作品と活動", en: "Works & Activities", zh: "作品与活动" },
  latest: { ja: "最新情報", en: "Latest", zh: "最新" },
} as const;
