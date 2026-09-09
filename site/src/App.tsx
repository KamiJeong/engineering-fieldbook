import { useEffect, useMemo, useRef, useState } from "react";
import type { PageData, SearchEntry } from "./model";
import { Sidebar } from "./Sidebar";
import { Learning } from "./Learning";
import { pathHref, topicTree } from "./navigation";
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
  const articleParts = useMemo(() => {
    const html = doc?.html || "";
    // Keep the original heading markup, IDs and body; only insert UI after H1.
    const end = html.indexOf("</h1>");
    return {
      title: { __html: end >= 0 ? html.slice(0, end + 5) : "" },
      body: { __html: end >= 0 ? html.slice(end + 5) : html },
    };
  }, [doc?.html]);
  const [locale, setLocale] = useState(data.language);
  const ui = locale === "ko" ? "ko" : "en";
  const t = labels[ui];
  const home = languageHome(data.base, locale);
  const [dark, setDark] = useState(false),
    [query, setQuery] = useState(""),
    [language, setLanguage] = useState(locale);
  const [index, setIndex] = useState<SearchEntry[] | null>(null),
    [searchError, setSearchError] = useState(false);
  const [pathId, setPathId] = useState<string>();
  const activePath = data.learningPaths.find(
    (p) =>
      p.id === pathId &&
      p.language === locale &&
      (p.url === doc?.url || p.steps.some((s) => s.url === doc?.url)),
  );
  useEffect(() => {
    setPathId(new URLSearchParams(location.search).get("path") || undefined);
  }, []);
  // Preserve a selected path for original article links without changing source HTML.
  useEffect(() => {
    const element = article.current;
    if (!element || !activePath) return;
    const changed: { link: HTMLAnchorElement; href: string }[] = [];
    for (const link of element.querySelectorAll<HTMLAnchorElement>("a[href]")) {
      const target = new URL(link.href);
      if (
        target.origin !== location.origin ||
        !target.pathname.startsWith(data.base)
      )
        continue;
      const next = pathHref(target.pathname, activePath);
      if (next !== target.pathname) {
        changed.push({ link, href: link.getAttribute("href")! });
        link.href = next + target.hash;
      }
    }
    return () => {
      for (const { link, href } of changed) link.setAttribute("href", href);
    };
  }, [activePath, data.base]);
  const diagramDialog = useRef<HTMLDialogElement>(null);
  const diagramCanvas = useRef<HTMLDivElement>(null);
  const diagramTrigger = useRef<HTMLButtonElement | null>(null);
  const dialog = useRef<HTMLDialogElement>(null),
    input = useRef<HTMLInputElement>(null),
    trigger = useRef<HTMLButtonElement>(null),
    article = useRef<HTMLElement>(null);
  const url = (source: string) =>
    data.entries.find((e) => e.source === source)?.url || home;
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("fieldbook-theme");
    } catch {
      /* Optional storage. */
    }
    const value =
      saved === "light" || saved === "dark"
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
        if (
          document.querySelector(
            '.sidebar-shell[aria-modal="true"], .diagram-dialog[open]',
          )
        )
          return;
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
      // Remove partial output from an earlier failed attempt before retrying.
      article.current
        ?.querySelectorAll("figure.diagram")
        .forEach((f) => f.remove());
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: dark ? "dark" : "default",
        htmlLabels: false,
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
        figure.dataset.theme = dark ? "dark" : "light";
        figure.innerHTML = purify.sanitize(svg, {
          USE_PROFILES: { svg: true, svgFilters: true },
        });
        const controls = document.createElement("div");
        controls.className = "diagram-controls";
        const zoom = document.createElement("button");
        zoom.type = "button";
        zoom.textContent = ui === "ko" ? "확대" : "Expand";
        zoom.onclick = () => {
          const svg = figure.querySelector("svg");
          if (!svg || !diagramCanvas.current) return;
          diagramCanvas.current.replaceChildren(svg.cloneNode(true));
          diagramCanvas.current.dataset.theme = figure.dataset.theme;
          diagramTrigger.current = zoom;
          diagramDialog.current?.showModal();
        };
        const close = document.createElement("button");
        close.type = "button";
        close.textContent = ui === "ko" ? "다이어그램 닫기" : "Close diagram";
        close.onclick = () => {
          figure.remove();
          // Keep the code and the render trigger available after closing.
          button.hidden = false;
          button.disabled = false;
          button.focus();
        };
        controls.append(zoom, close);
        figure.prepend(controls);
        code.closest("pre")?.after(figure);
      }
      button.hidden = true;
    } catch {
      button.disabled = false;
      button.textContent =
        ui === "ko"
          ? "다이어그램 오류 — 코드 원문을 확인하세요"
          : "Diagram failed — source remains available";
    }
  }
  function closeDiagram() {
    diagramDialog.current?.close();
    diagramCanvas.current?.replaceChildren();
    diagramTrigger.current?.focus();
  }
  const results = index ? search(index, query, language) : [];
  const recent = data.entries
    .filter((e) => e.modified && e.language === locale && e.conceptId)
    .sort(
      (a, b) =>
        Date.parse(b.modified!) - Date.parse(a.modified!) ||
        a.url.localeCompare(b.url),
    )
    .slice(0, 6);
  const topics = data.navigation[`knowledge/${locale}/index.md`] || [];
  const topicCounts = new Map(
    topicTree(data, locale).map(({ root, children }) => [
      root.url,
      children.length,
    ]),
  );
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
            className="search-trigger"
            onClick={() => void openSearch()}
            aria-label={t.placeholder}
          >
            {t.search}
            <kbd>Ctrl/⌘ K</kbd>
          </button>
          <button
            className="theme-trigger"
            onClick={theme}
            aria-label={t.theme}
            aria-pressed={dark}
          >
            <span className="theme-light" aria-hidden="true">
              ☀
            </span>
            <span className="theme-dark" aria-hidden="true">
              ☾
            </span>
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
                  href={pathHref(
                    target,
                    activePath &&
                      data.learningPaths.find(
                        (p) =>
                          p.id === activePath.id && p.language === language,
                      ),
                  )}
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
          <a className="header-github" href={data.repository}>
            GitHub ↗
          </a>
        </div>
      </header>
      <div className={`layout ${!doc ? "home-layout" : ""}`}>
        <Sidebar data={data} locale={locale} activePath={activePath} />
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
              <nav
                className="breadcrumbs"
                aria-label={ui === "ko" ? "현재 위치" : "Breadcrumb"}
              >
                <a href={home}>{t.home}</a>
                {crumbs.map((b, i) => (
                  <span key={i}>
                    {" "}
                    /{" "}
                    {b.entry ? (
                      <a href={b.entry.url}>{b.entry.title}</a>
                    ) : (
                      b.part
                    )}
                  </span>
                ))}
                <span> / {doc.title}</span>
              </nav>
              <article ref={article} className="prose" lang={doc.language}>
                <header className="doc-heading">
                  <div dangerouslySetInnerHTML={articleParts.title} />
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
                </header>
                <Learning data={data} locale={locale} active={activePath} />
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
                <div
                  className="article-body"
                  dangerouslySetInnerHTML={articleParts.body}
                />
              </article>
              <Learning
                data={data}
                locale={locale}
                active={activePath}
                footer
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
                  <p className="source-path">
                    <code>{doc.source}</code>
                  </p>
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
              <section className="home-intro">
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
                  <a
                    className="primary-link"
                    href={url(`knowledge/${locale}/index.md`)}
                  >
                    {t.nav} →
                  </a>
                  <span>
                    {
                      data.entries.filter((entry) => entry.language === locale)
                        .length
                    }{" "}
                    {ui === "ko" ? "공개 문서" : "published documents"}
                  </span>
                </div>
              </section>
              {!!data.learningPaths.filter((p) => p.language === locale)
                .length && (
                <section
                  className="learning-start"
                  aria-labelledby="start-title"
                >
                  <p className="learning-stages">
                    {ui === "ko"
                      ? "101 이해 → 201 적용 → 301 판단"
                      : "101 Understand → 201 Apply → 301 Evaluate"}
                  </p>
                  <h2 id="start-title">
                    {ui === "ko"
                      ? "학습 경로에서 시작하기"
                      : "Start with a reading path"}
                  </h2>
                  <p>
                    {ui === "ko"
                      ? "연결된 개념을 원본 목차의 순서대로 읽어보세요."
                      : "Follow connected concepts in the original index order."}
                  </p>
                  <div className="start-paths">
                    {data.learningPaths
                      .filter((p) => p.language === locale)
                      .map((p) => (
                        <div className="start-path" key={p.id}>
                          <div>
                            <strong>{p.title}</strong>
                            <small>
                              {p.steps.length}
                              {ui === "ko"
                                ? "개 문서 · 원본의 학습 순서"
                                : " documents · original reading order"}
                            </small>
                          </div>
                          <a href={pathHref(p.url, p)}>
                            {ui === "ko" ? "경로 살펴보기" : "Explore the path"}{" "}
                            →
                          </a>
                        </div>
                      ))}
                  </div>
                </section>
              )}
              <section className="home-section">
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
                        <span>
                          <strong>{item.title}</strong>
                          <small>
                            {topicCounts.get(item.url)
                              ? `${topicCounts.get(item.url)}${ui === "ko" ? "개 문서" : " documents"}`
                              : ui === "ko"
                                ? "상세 문서 준비 중"
                                : "Detailed guides coming later"}
                          </small>
                        </span>
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
                <a href={url("log.md")}>
                  {t.log}
                  {locale !== "ko" && (
                    <small className="language-note">한국어</small>
                  )}{" "}
                  →
                </a>
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
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  dialog.current
                    ?.querySelector<HTMLAnchorElement>(".search-results a")
                    ?.focus();
                }
              }}
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
          <p
            className="search-status"
            data-error={searchError}
            aria-live="polite"
          >
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
          <ul
            className="search-results"
            aria-label={t.results}
            onKeyDown={(e) => {
              if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
              const links = [
                ...e.currentTarget.querySelectorAll<HTMLAnchorElement>("a"),
              ];
              const position = links.indexOf(
                document.activeElement as HTMLAnchorElement,
              );
              if (position < 0) return;
              e.preventDefault();
              const next = position + (e.key === "ArrowDown" ? 1 : -1);
              if (next < 0) input.current?.focus();
              else links[Math.min(next, links.length - 1)]?.focus();
            }}
          >
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
      <dialog
        ref={diagramDialog}
        className="diagram-dialog"
        aria-labelledby="diagram-title"
        onCancel={(e) => {
          e.preventDefault();
          closeDiagram();
        }}
        onClick={(e) => {
          if (e.target === diagramDialog.current) closeDiagram();
        }}
      >
        <div className="search-heading">
          <h2 id="diagram-title">
            {ui === "ko" ? "다이어그램 확대" : "Expanded diagram"}
          </h2>
          <button onClick={closeDiagram}>{t.close}</button>
        </div>
        <div ref={diagramCanvas} className="diagram-canvas" />
      </dialog>
    </>
  );
}
