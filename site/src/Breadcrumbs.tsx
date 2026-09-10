import { useEffect, useRef, type ReactNode } from "react";

export function Breadcrumbs({
  label,
  parent,
  children,
}: {
  label: string;
  parent: string;
  children: ReactNode;
}) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const mobile = matchMedia("(max-width: 640px)");
    const resize = () => {
      if (disclosure.current) disclosure.current.open = !mobile.matches;
    };
    resize();
    mobile.addEventListener("change", resize);
    return () => mobile.removeEventListener("change", resize);
  }, []);
  return (
    <nav className="breadcrumbs" aria-label={label}>
      <details ref={disclosure} open>
        <summary>{parent}</summary>
        <div className="breadcrumb-trail">{children}</div>
      </details>
    </nav>
  );
}
