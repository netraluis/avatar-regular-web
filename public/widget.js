(function () {
  // Encuentra la etiqueta <script> que cargó este archivo
  const scriptTag = document.currentScript;

  // const domain = window.location.origin; // Ejemplo: "https://example.com"
  // const path = window.location.pathname;

  // console.log(domain, path);

  // Lee los atributos personalizados
  const teamId = scriptTag.getAttribute("data-team-id") || "";
  const assistantId = scriptTag.getAttribute("data-assistant-id") || "";
  let language = scriptTag.getAttribute("data-language") || "en";
  const src = scriptTag.getAttribute("data-src") || "";

  if (language !== "ca" && language !== "en") {
    language = "en";
  }

  const iframe = document.createElement("iframe");
  iframe.src = `${src}?teamId=${teamId}&assistantId=${assistantId}&language=${language}`; // Cambia esto por tu dominio real
  iframe.style.position = "fixed";
  iframe.style.bottom = "20px";
  iframe.style.right = "20px";
  iframe.style.width = "400px";
  iframe.style.height = "600px";
  iframe.style.border = "none";
  iframe.style.zIndex = "9999";
  // iframe.allow = 'clipboard-read; clipboard-write;'; // Opcional, permisos para funciones avanzadas
  document.body.appendChild(iframe);
})();
