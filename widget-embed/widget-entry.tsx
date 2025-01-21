// widget-embed/widget-entry.tsx
import { createRoot } from "react-dom/client";
import { Widget } from "./widget";

declare global {
  interface Window {
    __WIDGET_CONFIG__?: {
      appId?: string;
      user?: {
        name?: string;
        email?: string;
      };
    };
  }
}

(function initWidget() {
  const config = window.__WIDGET_CONFIG__ || {};

  const containerId = "__my_widget_container__";
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
  }

  // React 18: createRoot
  const root = createRoot(container);
  root.render(
    <Widget appId={config.appId} user={config.user} />
  );
})();
