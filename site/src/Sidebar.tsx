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
  const container = useRef<HTMLDivElement>(null);
  const shell = useRef<HTMLDetailsElement>(null);
  const key = `fieldbook-nav:${data.base}:${locale}`;
  const home = `${data.base}${locale === "ko" ? "" : `${locale}/`}`;
  const paths = data.learningPaths.filter((p) => p.language === locale);
  useEffect(() => {
    if (matchMedia("(max-width: 640px)").matches && shell.current)
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
            if (box.top < parent.top || box.bottom > parent.bottom)
              selected.scrollIntoView({ block: "nearest" });
          }
        });
    } catch {
      /* Storage is optional. */
    }
    setReady(true);
  }, [key, activeRoot]);
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
    <aside className="sidebar">
      <details
        ref={shell}
        open
        className="sidebar-shell"
        onToggle={(event) => {
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
        <summary>{ko ? "문서 탐색" : "Documents"}</summary>
        <div
          ref={container}
          className="sidebar-scroll"
          onScroll={() => {
            if (ready) save();
          }}
        >
          <nav aria-label={ko ? "전체 문서 탐색" : "All documents"}>
            <a href={home}>{ko ? "홈" : "Home"}</a>
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
                <summary>{root.title}</summary>
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
