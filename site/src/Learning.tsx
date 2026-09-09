import type { LearningPath, PageData } from "./model";
import { pathHref } from "./navigation";
export function Learning({
  data,
  locale,
  active,
  footer = false,
}: {
  data: PageData;
  locale: string;
  active?: LearningPath;
  footer?: boolean;
}) {
  const doc = data.document;
  const ko = locale === "ko";
  if (!doc) return null;
  const available = data.learningPaths.filter(
    (p) =>
      p.language === locale &&
      (p.url === doc.url || p.steps.some((s) => s.url === doc.url)),
  );
  if (!available.length) return null;
  if (!active)
    return footer ? null : (
      <section
        className="learning-context"
        aria-label={ko ? "학습 경로 선택" : "Choose a learning path"}
      >
        <strong>{ko ? "학습 경로 선택" : "Choose a learning path"}</strong>
        {available.map((p) => (
          <a key={p.id} href={pathHref(doc.url, p)}>
            {p.title} · {p.steps.length}
            {ko ? "개 문서" : " documents"}
          </a>
        ))}
        <small>
          {ko
            ? "경로를 선택하면 읽는 순서와 다음 문서를 안내합니다."
            : "Choose a path to see the reading order and next document."}
        </small>
        <noscript>
          {ko
            ? "경로별 이전·다음 안내에는 JavaScript가 필요합니다. 왼쪽 학습 경로의 원본 목차에서 전체 순서를 읽을 수 있습니다."
            : "Path-specific previous/next controls require JavaScript. The original index under Learning paths contains the complete reading order."}
        </noscript>
      </section>
    );
  const position = active.steps.findIndex((s) => s.url === doc.url);
  if (footer)
    return (
      <nav
        className="learning-next"
        aria-label={ko ? "학습 순서 이동" : "Reading sequence"}
      >
        {position > 0 && (
          <a href={pathHref(active.steps[position - 1].url, active)}>
            <small>{ko ? "이전 문서" : "Previous document"}</small>
            <strong>{active.steps[position - 1].title}</strong>
          </a>
        )}
        {position + 1 < active.steps.length ? (
          <a href={pathHref(active.steps[position + 1].url, active)}>
            <small>{ko ? "다음 문서" : "Next document"}</small>
            <strong>{active.steps[position + 1].title}</strong>
            <span>
              {
                data.entries.find(
                  (e) => e.url === active.steps[position + 1].url,
                )?.description
              }
            </span>
          </a>
        ) : (
          <p>
            {ko
              ? "이 경로의 마지막 문서입니다."
              : "This is the last document in this path."}{" "}
            <a href={pathHref(active.url, active)}>
              {ko ? "학습 경로 다시 보기" : "Review the reading path"}
            </a>
          </p>
        )}
      </nav>
    );
  return (
    <section
      className="learning-context"
      aria-label={ko ? "현재 학습 경로" : "Current learning path"}
    >
      <div>
        <a href={pathHref(active.url, active)}>{active.title}</a>
        {position >= 0 && (
          <span>
            {" "}
            / {active.steps[position].section} · {position + 1} /{" "}
            {active.steps.length} {ko ? "번째 문서" : "in reading order"}
          </span>
        )}
      </div>
      <details>
        <summary>{ko ? "학습 순서 보기" : "View reading order"}</summary>
        <ol>
          {active.steps.map((s) => (
            <li key={s.url}>
              <a
                href={pathHref(s.url, active)}
                aria-current={s.url === doc.url ? "page" : undefined}
              >
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </details>
      <a href={doc.url}>{ko ? "경로 선택 해제" : "Leave this path"}</a>
    </section>
  );
}
