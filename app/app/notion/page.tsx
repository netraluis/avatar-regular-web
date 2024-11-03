// app/notion/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function NotionCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    console.log({ code, error });

    if (code) {
      window.opener?.postMessage({ type: "NOTION_AUTH_SUCCESS", code }, "*");
      window.close();
    }

    if (error) {
      window.opener?.postMessage({ type: "NOTION_AUTH_ERROR", error }, "*");
      window.close();
    }
  }, [searchParams]);

  return <p>Procesando autenticación...</p>;
}

// Exporta la página usando Suspense directamente
export default function Page() {
  return (
    <Suspense fallback={<p>Procesando autenticación...</p>}>
      <NotionCallback />
    </Suspense>
  );
}
