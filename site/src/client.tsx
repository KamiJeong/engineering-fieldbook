import { hydrateRoot } from "react-dom/client";
import { App } from "./App";
import type { PageData } from "./model";
import "./style.css";
const data = JSON.parse(
  document.getElementById("page-data")!.textContent!,
) as PageData;
hydrateRoot(document.getElementById("app")!, <App data={data} />);
