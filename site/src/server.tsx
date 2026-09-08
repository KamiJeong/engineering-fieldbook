import { renderToString } from "react-dom/server";
import { App } from "./App";
import type { PageData } from "./model";
export function render(data: PageData) {
  return renderToString(<App data={data} />);
}
