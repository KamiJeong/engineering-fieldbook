import { useEffect, type RefObject } from "react";

export function useDiagrams({
  article,
  dialog,
  canvas,
  zoomTrigger,
  documentUrl,
  language,
}: {
  article: RefObject<HTMLElement | null>;
  dialog: RefObject<HTMLDialogElement | null>;
  canvas: RefObject<HTMLDivElement | null>;
  zoomTrigger: RefObject<HTMLButtonElement | null>;
  documentUrl?: string;
  language: string;
}) {
  useEffect(() => {
    const ko = language === "ko";
    let active = true;
    const cleanups: (() => void)[] = [];
    for (const [index, code] of [
      ...(article.current?.querySelectorAll<HTMLElement>(
        "code.language-mermaid",
      ) || []),
    ].entries()) {
      const pre = code.closest("pre");
      if (!pre) continue;
      let figure: HTMLElement | undefined;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "diagram-button";
      const label = ko ? "다이어그램 보기" : "Show diagram";
      button.textContent = label;
      button.setAttribute("aria-expanded", "false");
      const status = document.createElement("span");
      status.className = "sr-only";
      status.setAttribute("role", "status");
      pre.append(button);
      pre.after(status);
      const reveal = () => {
        figure?.focus({ preventScroll: true });
        figure?.scrollIntoView({ block: "center", behavior: "instant" });
      };
      button.onclick = async () => {
        status.className = "sr-only";
        if (figure) {
          reveal();
          return;
        }
        button.disabled = true;
        button.textContent = ko ? "그리는 중…" : "Rendering…";
        status.textContent = ko
          ? "다이어그램을 생성합니다."
          : "Rendering the diagram.";
        try {
          const [{ default: mermaid }, { default: purify }] = await Promise.all(
            [import("mermaid"), import("dompurify")],
          );
          if (!active) return;
          const theme =
            document.documentElement.dataset.theme === "dark"
              ? "dark"
              : "light";
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            theme: theme === "dark" ? "dark" : "default",
            htmlLabels: false,
            flowchart: { htmlLabels: false },
            maxTextSize: 20000,
          });
          const { svg } = await mermaid.render(
            `fieldbook-diagram-${index}`,
            code.textContent || "",
          );
          if (!active) return;
          figure = document.createElement("figure");
          figure.id = `fieldbook-diagram-result-${index}`;
          figure.className = "diagram";
          figure.tabIndex = -1;
          figure.dataset.theme = theme;
          figure.setAttribute(
            "aria-label",
            ko ? "생성된 다이어그램" : "Rendered diagram",
          );
          figure.innerHTML = purify.sanitize(svg, {
            USE_PROFILES: { svg: true, svgFilters: true },
          });
          const controls = document.createElement("div");
          controls.className = "diagram-controls";
          const zoom = document.createElement("button");
          zoom.type = "button";
          zoom.textContent = ko ? "확대" : "Expand";
          zoom.onclick = () => {
            const svg = figure?.querySelector("svg");
            if (!svg || !canvas.current) return;
            canvas.current.replaceChildren(svg.cloneNode(true));
            canvas.current.dataset.theme = theme;
            zoomTrigger.current = zoom;
            dialog.current?.showModal();
          };
          const close = document.createElement("button");
          close.type = "button";
          close.textContent = ko ? "다이어그램 닫기" : "Close diagram";
          close.onclick = () => {
            figure?.remove();
            figure = undefined;
            button.textContent = label;
            button.setAttribute("aria-expanded", "false");
            button.removeAttribute("aria-controls");
            status.textContent = ko
              ? "다이어그램을 닫았습니다. 코드 원문은 유지됩니다."
              : "Diagram closed. The source code remains available.";
            button.focus();
          };
          controls.append(zoom, close);
          figure.prepend(controls);
          const hint = document.createElement("figcaption");
          hint.textContent = ko
            ? "글자가 작으면 확대해서 확인하세요."
            : "Expand the diagram if the labels are too small.";
          figure.append(hint);
          pre.after(figure);
          button.textContent = ko ? "다이어그램으로 이동" : "Go to diagram";
          button.setAttribute("aria-controls", figure.id);
          button.setAttribute("aria-expanded", "true");
          status.textContent = ko
            ? "다이어그램을 표시했습니다."
            : "Diagram displayed.";
          reveal();
        } catch {
          button.textContent = label;
          status.textContent = ko
            ? "다이어그램 생성에 실패했습니다. 다시 시도하거나 코드 원문을 확인하세요."
            : "Diagram failed. Retry or read the source code.";
          // Keep failures visible as well as announced to assistive technology.
          status.className = "diagram-error";
        } finally {
          if (active) button.disabled = false;
        }
      };
      cleanups.push(() => {
        button.remove();
        status.remove();
        figure?.remove();
      });
    }
    return () => {
      active = false;
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [article, dialog, canvas, zoomTrigger, documentUrl, language]);
}
