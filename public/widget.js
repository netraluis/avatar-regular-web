(function () {
  // Encuentra la etiqueta <script> que cargó este archivo
  const scriptTag = document.currentScript;

  const domain = window.location.origin; // Ejemplo: "https://example.com"
  const path = window.location.pathname;

  console.log(domain, path);

  // Lee los atributos personalizados
  const teamId = scriptTag.getAttribute("data-team-id") || "";
  const assistantId = scriptTag.getAttribute("data-assistant-id") || "";
  const language = scriptTag.getAttribute("data-language") || "en";

  const iframe = document.createElement("iframe");
  iframe.src = `${process.env.NEXT_PUBLIC_PROTOCOL ? process.env.NEXT_PUBLIC_PROTOCOL : "https://"}chatbotfor-widget.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/chatbot-widget?teamId=${teamId}&assistantId=${assistantId}&language=${language}`; // Cambia esto por tu dominio real
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
