// app/callbacks/notion/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function NotionCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      window.opener?.postMessage({ type: "NOTION_AUTH_SUCCESS", code }, "*");
      window.close();
    }
  }, [searchParams]);

  return <p>Procesando autenticación...</p>;
}

// Exporta la página usando Suspense directamente
export default function Page() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <NotionCallback />
    </Suspense>
  );
}
