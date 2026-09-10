import type { Heading } from "./model";

export function MobileToc({
  headings,
  label,
  language,
}: {
  headings: Heading[];
  label: string;
  language: string;
}) {
  const groups: { heading: Heading; children: Heading[] }[] = [];
  for (const heading of headings.filter((item) => item.depth > 1)) {
    if (heading.depth === 2 || !groups.length)
      groups.push({ heading, children: [] });
    else groups.at(-1)!.children.push(heading);
  }
  const link = (heading: Heading) => (
    <a
      key={heading.id}
      className={`depth-${heading.depth}`}
      href={`#${encodeURIComponent(heading.id)}`}
      onClick={(event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        const target = document.getElementById(heading.id);
        const disclosure =
          event.currentTarget.closest<HTMLDetailsElement>(".mobile-toc");
        if (!target || !disclosure) return;
        event.preventDefault();
        disclosure.open = false;
        const hash = `#${encodeURIComponent(heading.id)}`;
        if (location.hash !== hash) history.pushState(null, "", hash);
        requestAnimationFrame(() => {
          const previous = target.getAttribute("tabindex");
          if (previous === null) {
            target.tabIndex = -1;
            target.addEventListener(
              "blur",
              () => target.removeAttribute("tabindex"),
              { once: true },
            );
          }
          target.focus({ preventScroll: true });
          target.scrollIntoView({
            block: "start",
            behavior: "instant",
          });
        });
      }}
    >
      {heading.title}
    </a>
  );
  return (
    <details className="mobile-toc">
      <summary>{label}</summary>
      <nav aria-label={label}>
        {groups.map(({ heading, children }) => (
          <div key={heading.id}>
            {link(heading)}
            {!!children.length && (
              <details className="toc-subsections">
                <summary>
                  {language === "ko" ? "하위 절" : "Subsections"} (
                  {children.length})
                </summary>
                {children.map(link)}
              </details>
            )}
          </div>
        ))}
      </nav>
    </details>
  );
}
