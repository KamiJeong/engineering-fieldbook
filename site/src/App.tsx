import { useEffect, useMemo, useRef, useState } from "react";
import type { PageData, SearchEntry } from "./model";
import { search } from "./search";
const languageHome = (base: string, language: string) =>
  `${base}${language === "ko" ? "" : `${encodeURIComponent(language)}/`}`;
const languageName = (language: string) =>
  ({ ko: "한국어", en: "English", ja: "日本語" })[language] || language;
const labels = {
  ko: {
    home: "홈",
    search: "검색",
    close: "닫기",
    nav: "문서 탐색",
    toc: "이 문서에서",
    glossary: "용어집",
    log: "문서 변경 이력",
    theme: "테마 변경",
    topics: "주제별로 읽기",
    recent: "최근 변경 문서",
    missing: "번역 없음",
    alternative: "언어별 문서 목록",
    sources: "출처",
    view: "GitHub에서 보기",
    edit: "수정 제안",
    updated: "수정일",
    unknown: "확인되지 않음",
    empty: "검색 결과가 없습니다.",
    loading: "검색 인덱스를 불러오는 중…",
    error: "검색을 불러오지 못했습니다. 다시 시도해 주세요.",
    all: "모든 언어",
    placeholder: "제목, 본문, 태그 검색",
    notFound: "문서를 찾을 수 없습니다",
    notFoundBody:
      "주소가 변경되었거나 게시 대상이 아닌 문서입니다. 홈이나 검색에서 찾아보세요.",
    intro:
      "기본 개념을 이해하고, 예제로 적용하며, 기술 선택의 근거를 배웁니다.",
    skip: "본문으로 이동",
    results: "검색 결과",
    translation: "문서 번역",
    interface: "화면 언어",
    copy: "복사",
    copied: "복사됨",
    copyError: "복사 실패",
    diagram: "다이어그램 보기",
  },
  en: {
    home: "Home",
    search: "Search",
    close: "Close",
    nav: "Documents",
    toc: "On this page",
    glossary: "Glossary",
    log: "Knowledge change log",
    theme: "Change theme",
    topics: "Browse by topic",
    recent: "Recently changed",
    missing: "No translation",
    alternative: "Browse documents by language",
    sources: "Sources",
    view: "View on GitHub",
    edit: "Suggest an edit",
    updated: "Modified",
    unknown: "Unknown",
    empty: "No matching documents.",
    loading: "Loading search index…",
    error: "Could not load search. Please try again.",
    all: "All languages",
    placeholder: "Search titles, content and tags",
    notFound: "Document not found",
    notFoundBody:
      "The address may have changed or the document is not published. Try home or search.",
    intro:
      "Understand the fundamentals, apply examples, and learn how to justify technical choices.",
    skip: "Skip to content",
    results: "Search results",
    translation: "Document translations",
    interface: "Interface language",
    copy: "Copy",
    copied: "Copied",
    copyError: "Copy failed",
    diagram: "Show diagram",
  },
};
const encode = (s: string) => s.split("/").map(encodeURIComponent).join("/");
export function App({ data }: { data: PageData }) {
  const doc = data.document;
  // Keep React from replacing the sanitized article on unrelated UI updates.
  // Copy controls and rendered diagrams intentionally live inside this DOM.
  const articleHtml = useMemo(() => ({ __html: doc?.html || "" }), [doc?.html]);
  const [locale, setLocale] = useState(data.language);
  const ui = locale === "ko" ? "ko" : "en";
  const t = labels[ui];
  const home = languageHome(data.base, locale);
  const [dark, setDark] = useState(false),
    [query, setQuery] = useState(""),
    [language, setLanguage] = useState(locale);
  const [index, setIndex] = useState<SearchEntry[] | null>(null),
    [searchError, setSearchError] = useState(false);
  const sidebar = useRef<HTMLDetailsElement>(null);
  const dialog = useRef<HTMLDialogElement>(null),
    input = useRef<HTMLInputElement>(null),
    trigger = useRef<HTMLButtonElement>(null),
    article = useRef<HTMLElement>(null);
  const url = (source: string) =>
    data.entries.find((e) => e.source === source)?.url || home;
  useEffect(() => {
    if (matchMedia("(max-width: 640px)").matches && sidebar.current)
      sidebar.current.open = false;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("fieldbook-theme");
    } catch {
      /* Optional storage. */
    }
    const value = saved
      ? saved === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(value);
    document.documentElement.dataset.theme = value ? "dark" : "light";
  }, []);
  useEffect(() => {
    // Pages serves one 404.html for all paths. Keep the first render identical
    // to its static HTML, then select the requested locale without a redirect.
    if (!data.notFound) return;
    let requested = "";
    try {
      requested = decodeURIComponent(
        location.pathname.slice(data.base.length).split("/")[0],
      );
    } catch {
      /* An invalid URL uses the default fallback. */
    }
    const language =
      location.pathname.startsWith(data.base) &&
      data.languages.includes(requested)
        ? requested
        : "ko";
    setLocale(language);
    setLanguage(language);
    document.title = `${labels[language === "ko" ? "ko" : "en"].notFound} · Fieldbook`;
  }, [data.notFound, data.base, data.languages]);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  function theme() {
    const value = !dark;
    setDark(value);
    document.documentElement.dataset.theme = value ? "dark" : "light";
    try {
      localStorage.setItem("fieldbook-theme", value ? "dark" : "light");
    } catch {
      /* Theme works in memory. */
    }
  }
  async function openSearch() {
    dialog.current?.showModal();
    input.current?.focus();
    if (!index) {
      setSearchError(false);
      try {
        const response = await fetch(`${data.base}search.json`);
        if (!response.ok) throw new Error("Search unavailable");
        setIndex(await response.json());
      } catch {
        setSearchError(true);
      }
    }
  }
  function closeSearch() {
    dialog.current?.close();
    trigger.current?.focus();
  }
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        trigger.current?.click();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    const buttons: HTMLButtonElement[] = [];
    for (const pre of article.current?.querySelectorAll("pre") || []) {
      const code = pre.querySelector("code");
      if (!code) continue;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "copy-code";
      button.textContent = t.copy;
      button.onclick = async () => {
        try {
          await navigator.clipboard.writeText(code.textContent || "");
          button.textContent = t.copied;
        } catch {
          button.textContent = t.copyError;
        }
      };
      pre.append(button);
      buttons.push(button);
    }
    return () => buttons.forEach((b) => b.remove());
  }, [doc?.url, t.copy, t.copied, t.copyError]);
  async function diagrams(event: React.MouseEvent<HTMLButtonElement>) {
    const button = event.currentTarget;
    button.disabled = true;
    try {
      const [{ default: mermaid }, { default: purify }] = await Promise.all([
        import("mermaid"),
        import("dompurify"),
      ]);
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: dark ? "dark" : "default",
        flowchart: { htmlLabels: false },
        maxTextSize: 20000,
      });
      let i = 0;
      for (const code of article.current?.querySelectorAll(
        "code.language-mermaid",
      ) || []) {
        const { svg } = await mermaid.render(
          `fieldbook-diagram-${i++}`,
          code.textContent || "",
        );
        const figure = document.createElement("figure");
        figure.className = "diagram";
        figure.innerHTML = purify.sanitize(svg, {
          USE_PROFILES: { svg: true, svgFilters: true },
        });
        code.closest("pre")?.after(figure);
      }
      button.hidden = true;
    } catch {
      button.textContent =
        ui === "ko"
          ? "다이어그램 오류 — 코드 원문을 확인하세요"
          : "Diagram failed — source remains available";
    }
  }
  const results = index ? search(index, query, language) : [];
  const directory = doc?.source.split("/").slice(0, -1).join("/");
  const scope = !doc
    ? `knowledge/${locale}/index.md`
    : doc && data.navigation[doc.source]
      ? doc.source
      : directory
        ? `${directory}/index.md`
        : "index.md";
  const scopeTitle = data.entries.find(
    (entry) => entry.source === scope,
  )?.title;
  const globalLinks = new Set([
    home,
    url("index.md"),
    url(`knowledge/${locale}/index.md`),
    url(`glossary/${locale}/index.md`),
  ]);
  const nav = (
    data.navigation[scope] ||
    data.navigation[`knowledge/${locale}/index.md`] ||
    []
  ).filter(
    (item) =>
      !globalLinks.has(item.url) &&
      data.entries.some(
        (entry) => entry.url === item.url && entry.language === locale,
      ),
  );
  const recent = data.entries
    .filter((e) => e.modified && e.language === locale && e.conceptId)
    .sort(
      (a, b) =>
        Date.parse(b.modified!) - Date.parse(a.modified!) ||
        a.url.localeCompare(b.url),
    )
    .slice(0, 6);
  const topics = data.navigation[`knowledge/${locale}/index.md`] || [];
  const crumbs = doc
    ? doc.source
        .split("/")
        .slice(0, -1)
        .map((part, i, parts) => ({
          part,
          entry: data.entries.find(
            (e) =>
              e.language === locale &&
              (e.source ===
                `${parts.slice(0, i + 1).join("/")}/${locale}/index.md` ||
                e.source === `${parts.slice(0, i + 1).join("/")}/index.md`),
          ),
        }))
        .filter((crumb) => crumb.part !== locale)
    : [];
  return (
    <>
      <a className="skip" href="#content">
        {t.skip}
      </a>
      <header className="site-header">
        <a className="brand" href={home}>
          <span className="brand-mark" aria-hidden="true">
            F
          </span>
          <strong>Fieldbook</strong>
        </a>
        <nav className="top-nav" aria-label={t.home}>
          <a href={url(`glossary/${locale}/index.md`)}>{t.glossary}</a>
          <a href={url("log.md")}>
            {t.log}
            {locale !== "ko" && <small className="language-note">한국어</small>}
          </a>
        </nav>
        <div className="tools">
          <button
            ref={trigger}
            onClick={() => void openSearch()}
            aria-label={t.placeholder}
          >
            {t.search}
            <kbd>Ctrl/⌘ K</kbd>
          </button>
          <button onClick={theme} aria-label={t.theme} aria-pressed={dark}>
            {dark ? "☀" : "☾"}
          </button>
          <nav className="language-switch" aria-label={t.translation}>
            {data.languages.map((language) => {
              const target = doc
                ? language === locale
                  ? doc.url
                  : doc.translations[language]
                : languageHome(data.base, language);
              return target ? (
                <a
                  key={language}
                  href={target}
                  lang={language}
                  aria-current={language === locale ? "page" : undefined}
                >
                  {languageName(language)}
                </a>
              ) : (
                <span key={language} aria-disabled="true" title={t.missing}>
                  {languageName(language)}
                </span>
              );
            })}
          </nav>
        </div>
      </header>
      <div className={`layout ${!doc ? "home-layout" : ""}`}>
        <aside className="sidebar">
          <details ref={sidebar} open>
            <summary>{t.nav}</summary>
            <nav aria-label={t.nav}>
              <a
                href={home}
                aria-current={!doc && !data.notFound ? "page" : undefined}
              >
                {t.home}
              </a>
              <a href={url(`knowledge/${locale}/index.md`)}>
                {ui === "ko" ? "전체 지식" : "All knowledge"}
              </a>
              <a href={url(`glossary/${locale}/index.md`)}>{t.glossary}</a>
              <a
                className="fieldbook-map"
                href={url("index.md")}
                aria-current={doc?.source === "index.md" ? "page" : undefined}
              >
                {ui === "ko" ? "전체 문서 지도" : "All collections"}
                {locale !== "ko" && (
                  <small className="language-note">한국어</small>
                )}
              </a>
              <p className="nav-section">
                {doc
                  ? ui === "ko"
                    ? "같은 주제의 문서"
                    : "In this section"
                  : t.topics}
              </p>
              {nav.map((item, i) => (
                <div key={`${item.url}-${i}`}>
                  {item.section &&
                    item.section !== scopeTitle &&
                    (i === 0 || nav[i - 1].section !== item.section) && (
                      <p className="nav-section">{item.section}</p>
                    )}
                  <a
                    href={item.url}
                    aria-current={item.url === doc?.url ? "page" : undefined}
                  >
                    {item.title}
                  </a>
                </div>
              ))}
            </nav>
          </details>
        </aside>
        <main id="content" tabIndex={-1}>
          {data.notFound ? (
            <section className="not-found">
              <p className="eyebrow">404</p>
              <h1>{t.notFound}</h1>
              <p>{t.notFoundBody}</p>
              <noscript>
                <p lang="en">
                  Page not found. Check the address or open the English home.{" "}
                  <a href={languageHome(data.base, "en")}>English home</a>
                </p>
              </noscript>
              <a href={home}>{t.home} →</a>
              <p>
                <button onClick={() => void openSearch()}>{t.search}</button>
              </p>
            </section>
          ) : doc ? (
            <>
              <nav className="breadcrumbs" aria-label="Breadcrumb">
                <a href={home}>{t.home}</a>
                {crumbs.map((b, i) => (
                  <span key={i}>
                    {" "}
                    / {b.entry ? <a href={b.entry.url}>{b.part}</a> : b.part}
                  </span>
                ))}
                <span> / {doc.title}</span>
              </nav>
              <div className="doc-meta">
                <span>{languageName(doc.language)}</span>
                <span>
                  {t.updated}:{" "}
                  {doc.modified ? (
                    <time dateTime={doc.modified}>
                      {doc.modified.slice(0, 10)}
                    </time>
                  ) : (
                    t.unknown
                  )}
                </span>
              </div>
              {data.languages.some(
                (language) =>
                  language !== locale && !doc.translations[language],
              ) && (
                <div
                  className="translation translation-missing"
                  aria-label={t.translation}
                >
                  {data.languages
                    .filter(
                      (language) =>
                        language !== locale && !doc.translations[language],
                    )
                    .map((language) => (
                      <span key={language}>
                        {languageName(language)}: {t.missing} ·{" "}
                        <a href={languageHome(data.base, language)}>
                          {languageName(language)} {t.home}
                        </a>
                      </span>
                    ))}
                </div>
              )}
              {doc.mermaid && (
                <button
                  className="diagram-button"
                  onClick={(e) => void diagrams(e)}
                >
                  {t.diagram}
                </button>
              )}
              <details className="mobile-toc">
                <summary>{t.toc}</summary>
                <nav aria-label={t.toc}>
                  {doc.toc
                    .filter((h) => h.depth > 1)
                    .map((h) => (
                      <a key={h.id} href={`#${encodeURIComponent(h.id)}`}>
                        {h.title}
                      </a>
                    ))}
                </nav>
              </details>
              <article
                ref={article}
                className="prose"
                lang={doc.language}
                dangerouslySetInnerHTML={articleHtml}
              />
              {!!doc.tags.length && (
                <div className="tags">
                  {doc.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              )}
              {(!!doc.sources.length ||
                doc.status ||
                doc.freshness ||
                doc.translationStatus ||
                doc.dateSource) && (
                <details className="sources">
                  <summary>
                    {ui === "ko"
                      ? "문서 정보와 출처"
                      : "Document information and sources"}
                  </summary>
                  <p>
                    {[
                      doc.status,
                      doc.freshness,
                      doc.translationStatus,
                      doc.dateSource,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <ul>
                    {doc.sources.map((s, i) => (
                      <li key={i}>
                        {s.url ? (
                          <a href={s.url}>{s.title}</a>
                        ) : (
                          <span>
                            {s.title} · {t.unknown}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              {!!doc.verified.length && (
                <details className="verification">
                  <summary>
                    {ui === "ko"
                      ? "원본의 검증 기록"
                      : "Verification recorded in source"}
                  </summary>
                  <ul>
                    {doc.verified.map((v, i) => (
                      <li key={i}>
                        <time dateTime={v.at}>{v.at}</time> · {v.by}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              <footer className="doc-footer">
                <code>{doc.source}</code>
                <div>
                  <a
                    href={`${data.repository}/blob/${encode(data.branch)}/${encode(doc.source)}`}
                  >
                    {t.view}
                  </a>
                  <a
                    href={`${data.repository}/edit/${encode(data.branch)}/${encode(doc.source)}`}
                  >
                    {t.edit}
                  </a>
                </div>
              </footer>
            </>
          ) : (
            <>
              <p className="eyebrow">
                {ui === "ko"
                  ? "개념부터 설계 판단까지"
                  : "From concepts to design decisions"}
              </p>
              <h1 className="home-title">
                {ui === "ko" ? "지식 공유소" : "Engineering Fieldbook"}
              </h1>
              <p className="intro">{t.intro}</p>
              <div className="home-links">
                <a href={url(`knowledge/${locale}/index.md`)}>{t.nav} →</a>
                <span>
                  {
                    data.entries.filter((entry) => entry.language === locale)
                      .length
                  }{" "}
                  {ui === "ko" ? "공개 문서" : "published documents"}
                </span>
              </div>
              <section>
                <h2>{t.topics}</h2>
                <div className="topics">
                  {topics
                    .filter(
                      (n) =>
                        n.url.includes("/knowledge/") &&
                        data.entries.some(
                          (entry) =>
                            entry.url === n.url && entry.language === locale,
                        ),
                    )
                    .map((item, i) => (
                      <a key={i} href={item.url}>
                        <span className="page-icon" aria-hidden="true">
                          ▤
                        </span>
                        <strong>{item.title}</strong>
                        <span aria-hidden="true">→</span>
                      </a>
                    ))}
                </div>
              </section>
              <section className="recent">
                <h2>{t.recent}</h2>
                {recent.map((e) => (
                  <a key={e.url} href={e.url}>
                    <time dateTime={e.modified}>
                      {e.modified?.slice(0, 10)}
                    </time>
                    <span>
                      {e.title}
                      <small>{e.category}</small>
                    </span>
                  </a>
                ))}
              </section>
              <section className="reading-links">
                <a href={url(`glossary/${locale}/index.md`)}>{t.glossary} →</a>
                <a href={url("log.md")}>{t.log} →</a>
              </section>
            </>
          )}
        </main>
        {doc && (
          <aside className="toc">
            <nav aria-label={t.toc}>
              <p className="nav-section">{t.toc}</p>
              {doc.toc
                .filter((h) => h.depth > 1)
                .map((h) => (
                  <a
                    key={h.id}
                    className={`depth-${h.depth}`}
                    href={`#${encodeURIComponent(h.id)}`}
                  >
                    {h.title}
                  </a>
                ))}
            </nav>
          </aside>
        )}
      </div>
      <footer className="site-footer">
        Engineering Fieldbook <a href={data.repository}>GitHub ↗</a>
      </footer>
      <dialog
        ref={dialog}
        className="search-dialog"
        aria-labelledby="search-title"
        onCancel={(e) => {
          e.preventDefault();
          closeSearch();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            closeSearch();
          }
        }}
        onClick={(e) => {
          if (e.target === dialog.current) closeSearch();
        }}
      >
        <div className="search-panel">
          <div className="search-heading">
            <h2 id="search-title">{t.search}</h2>
            <button onClick={closeSearch}>
              {t.close} <kbd>Esc</kbd>
            </button>
          </div>
          <label>
            <span className="sr-only">{t.placeholder}</span>
            <input
              ref={input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              type="search"
            />
          </label>
          <label className="search-filter">
            {ui === "ko" ? "검색 언어" : "Search language"}{" "}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="">{t.all}</option>
              {data.languages.map((l) => (
                <option key={l} value={l}>
                  {languageName(l)}
                </option>
              ))}
            </select>
          </label>
          <p aria-live="polite">
            {searchError
              ? t.error
              : !index
                ? t.loading
                : query.trim()
                  ? `${results.length} · ${t.results}`
                  : t.placeholder}
          </p>
          {searchError && (
            <button onClick={() => void openSearch()}>{t.search}</button>
          )}
          <ul className="search-results">
            {results.map((e) => (
              <li key={e.url}>
                <a href={e.url}>
                  <strong>{e.title}</strong>
                  <small>
                    {languageName(e.language)} · {e.category}
                  </small>
                  <p>{e.description}</p>
                </a>
              </li>
            ))}
          </ul>
          {index && query.trim() && !results.length && <p>{t.empty}</p>}
        </div>
      </dialog>
    </>
  );
}
