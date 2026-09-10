import { useEffect, useRef, useState } from "react";
import type { LearningPath, PageData } from "./model";
import { pathHref, topicTree } from "./navigation";

export function Sidebar({
  data,
  locale,
  activePath,
}: {
  data: PageData;
  locale: string;
  activePath?: LearningPath;
}) {
  const ko = locale === "ko";
  const tree = topicTree(data, locale);
  const current = data.document?.source;
  const activeRoot = tree.find(
    (t) =>
      t.root.source === current ||
      t.children.some((c) => c.entry.source === current),
  )?.root.source;
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const shell = useRef<HTMLDetailsElement>(null);
  const key = `fieldbook-nav:${data.base}:${locale}`;
  const home = `${data.base}${locale === "ko" ? "" : `${locale}/`}`;
  const paths = data.learningPaths.filter((p) => p.language === locale);
  useEffect(() => {
    if (matchMedia("(max-width: 900px)").matches && shell.current)
      shell.current.open = false;
    try {
      const saved = JSON.parse(sessionStorage.getItem(key) || "{}");
      setOpen({ ...saved.open, ...(activeRoot ? { [activeRoot]: true } : {}) });
      if (container.current)
        requestAnimationFrame(() => {
          if (!container.current) return;
          container.current.scrollTop = Number(saved.scroll) || 0;
          const selected = container.current.querySelector<HTMLElement>(
            '[aria-current="page"]',
          );
          if (selected) {
            const box = selected.getBoundingClientRect(),
              parent = container.current.getBoundingClientRect();
            // Scroll only the panel. scrollIntoView also changes the browser's
            // sequential focus starting point, bypassing the page's skip link.
            if (box.top < parent.top)
              container.current.scrollTop += box.top - parent.top;
            else if (box.bottom > parent.bottom)
              container.current.scrollTop += box.bottom - parent.bottom;
          }
        });
    } catch {
      /* Storage is optional. */
    }
    setReady(true);
  }, [key, activeRoot]);
  useEffect(() => {
    const media = matchMedia("(max-width: 900px)");
    const resize = () => {
      setDrawer(false);
      if (shell.current) shell.current.open = !media.matches;
    };
    media.addEventListener("change", resize);
    return () => media.removeEventListener("change", resize);
  }, []);
  useEffect(() => {
    if (!drawer) return;
    const outside = [
      ...document.querySelectorAll<HTMLElement>(
        ".site-header, main, .toc, .site-footer, .skip",
      ),
    ];
    const previous = outside.map((node) => node.inert);
    outside.forEach((node) => {
      node.inert = true;
    });
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    shell.current?.querySelector("summary")?.focus();
    return () => {
      outside.forEach((node, i) => {
        node.inert = previous[i];
      });
      document.body.style.overflow = overflow;
    };
  }, [drawer]);
  function closeDrawer() {
    if (shell.current) {
      shell.current.open = false;
      setDrawer(false);
      shell.current.querySelector("summary")?.focus();
    }
  }
  function save(next = open) {
    try {
      sessionStorage.setItem(
        key,
        JSON.stringify({
          open: next,
          scroll: container.current?.scrollTop || 0,
        }),
      );
    } catch {
      /* Storage is optional. */
    }
  }
  return (
    <aside className="sidebar" data-ready={ready}>
      <details
        ref={shell}
        open
        className="sidebar-shell"
        role={drawer ? "dialog" : undefined}
        aria-modal={drawer ? true : undefined}
        aria-label={drawer ? (ko ? "문서 탐색" : "Documents") : undefined}
        onClick={(e) => {
          if (drawer && e.target === shell.current) closeDrawer();
        }}
        onKeyDown={(e) => {
          if (!drawer) return;
          if (e.key === "Escape") {
            e.preventDefault();
            closeDrawer();
          } else if (e.key === "Tab") {
            const controls = [
              ...e.currentTarget.querySelectorAll<HTMLElement>(
                "summary, a[href], button",
              ),
            ].filter((node) => node.checkVisibility());
            const first = controls[0],
              last = controls.at(-1);
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first?.focus();
            }
          }
        }}
        onToggle={(event) => {
          setDrawer(
            ready &&
              event.currentTarget.open &&
              matchMedia("(max-width: 900px)").matches,
          );
          if (!event.currentTarget.open) return;
          requestAnimationFrame(() => {
            const panel = container.current;
            const selected = panel?.querySelector<HTMLElement>(
              '[aria-current="page"]',
            );
            if (!panel || !selected) return;
            const item = selected.getBoundingClientRect(),
              box = panel.getBoundingClientRect();
            if (item.top < box.top || item.bottom > box.bottom)
              panel.scrollTop += item.top - box.top;
          });
        }}
      >
        <summary
          aria-controls="sidebar-navigation"
          aria-label={
            drawer ? (ko ? "문서 탐색 닫기" : "Close documents") : undefined
          }
        >
          {ko ? "문서 탐색" : "Documents"}
          <span className="drawer-close-mark" aria-hidden="true">
            ×
          </span>
        </summary>
        <div
          ref={container}
          id="sidebar-navigation"
          className="sidebar-scroll"
          onScroll={() => {
            if (ready) save();
          }}
        >
          <nav aria-label={ko ? "전체 문서 탐색" : "All documents"}>
            <a
              href={home}
              aria-current={
                !data.document && !data.notFound ? "page" : undefined
              }
            >
              {ko ? "홈" : "Home"}
            </a>
            <a
              href={
                data.entries.find(
                  (e) => e.source === `knowledge/${locale}/index.md`,
                )?.url || home
              }
            >
              {ko ? "전체 지식" : "All knowledge"}
            </a>
            <a
              className="fieldbook-map"
              href={
                data.entries.find((e) => e.source === "index.md")?.url || home
              }
            >
              {ko ? "전체 문서 지도" : "All collections"}
              {!ko && <small className="language-note">한국어</small>}
            </a>
            <p className="nav-section">{ko ? "학습 경로" : "Learning paths"}</p>
            {paths.map((p) => (
              <a
                key={p.id}
                className={p.id === activePath?.id ? "active-path" : ""}
                href={pathHref(p.url, p)}
              >
                {p.title}
              </a>
            ))}
            <p className="nav-section">{ko ? "전체 목차" : "All topics"}</p>
            {tree.map(({ root, children }) => (
              <details
                className="nav-group"
                key={root.source}
                open={ready ? !!open[root.source] : root.source === activeRoot}
                onToggle={(e) => {
                  if (!ready) return;
                  const value = e.currentTarget.open;
                  if (!!open[root.source] === value) return;
                  const next = { ...open, [root.source]: value };
                  setOpen(next);
                  save(next);
                }}
              >
                <summary>
                  {root.url.includes("/glossary/")
                    ? ko
                      ? "용어집"
                      : "Glossary"
                    : root.title}
                </summary>
                <div className="nav-children">
                  <a
                    href={pathHref(root.url, activePath)}
                    aria-current={root.source === current ? "page" : undefined}
                  >
                    {ko ? "개요" : "Overview"}
                  </a>
                  {!children.length && (
                    <span className="nav-empty">
                      {ko
                        ? "상세 문서 준비 중"
                        : "Detailed guides coming later"}
                    </span>
                  )}
                  {children.map(({ entry, section }, i) => (
                    <div key={entry.source}>
                      {section && section !== children[i - 1]?.section && (
                        <p className="nav-section">{section}</p>
                      )}
                      <a
                        href={pathHref(entry.url, activePath)}
                        aria-current={
                          entry.source === current ? "page" : undefined
                        }
                      >
                        {entry.title}
                      </a>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </nav>
        </div>
      </details>
    </aside>
  );
}
