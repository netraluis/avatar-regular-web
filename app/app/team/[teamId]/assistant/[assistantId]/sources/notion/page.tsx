"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { useFileVectorStoreAssistant } from "@/components/context/appContext";
import { Loader } from "@/components/loader";

export default function Component() {
  const [popup, setPopup] = useState<Window | null>(null);
  const redirectUri = "https://app.netraluis.com/notion";

  useEffect(() => {
    // Listener para el mensaje de autenticación completada
    const handleAuthMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return; // Seguridad: verificar el origen

      console.log({ event });

      if (event.data.type === "NOTION_AUTH_SUCCESS") {
        console.log("Autenticación completada con código:", event.data.code);

        // Aquí puedes hacer una llamada a tu backend para intercambiar el código por un token

        const encoded = Buffer.from(
          `${process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID}:${process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET}`
        ).toString("base64");

        try {
          const response = await fetch(
            "https://api.notion.com/v1/oauth/token",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Basic ${encoded}`,
              },
              body: JSON.stringify({
                grant_type: "authorization_code",
                code: event.data.code,
                redirect_uri: redirectUri,
              }),
            }
          );

          const data = await response.json();
          console.log("data access_token", data);
          const accessToken = data.access_token;

          const searchResponse = await fetch(
            "https://api.notion.com/v1/search",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Notion-Version": "2021-08-16", // Asegúrate de usar la versión adecuada de la API
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                filter: {
                  value: "page",
                  property: "object",
                },
              }),
            }
          );

          const searchData = await searchResponse.json();
          console.log("Páginas autorizadas:", searchData);
        } catch (e) {
          console.log("error", e);
        }

        if (popup && !popup.closed) {
          popup.close(); // Cierra la ventana emergente
          setPopup(null); // Limpia la referencia
        }
      }
    };

    window.addEventListener("message", handleAuthMessage);

    return () => {
      window.removeEventListener("message", handleAuthMessage);
    };
  }, [popup]);

  const {
    getFileVectorStore,
    getFileloading,
    getFileError,
    deleteFileVectorStore,
    fileData,
  } = useFileVectorStoreAssistant();

  const params = useParams();

  const fetchData = async () => {
    await getFileVectorStore({ assistantId: params.assistantId as string });
  };

  useEffect(() => {
    fetchData();
  }, [params.assistantId]);

  const handleDelete = async (fileId: string) => {
    await deleteFileVectorStore({ fileId });
  };

  const openNotionAuthPopup = () => {
    const authUrl = process.env.NEXT_PUBLIC_NOTION_AUTH_URL;

    // Configura las opciones de la ventana emergente
    const popupOptions = "width=600,height=700,left=100,top=100";

    // Abre la ventana emergente con la URL de autenticación
    const popup = window.open(authUrl, "NotionAuth", popupOptions);

    // Monitorea si la ventana emergente se cierra
    const popupInterval = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(popupInterval);
        alert("Autenticación completada o ventana cerrada.");
        // Aquí puedes actualizar el estado de autenticación si es necesario
      }
    }, 500);
  };

  return (
    <>
      <div className="flex-1 p-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Notion</h1>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Nutre a tu assistente con tablas de Notion
          </p>
          <div className="flex justify-between items-center mb-4">
            <Input
              type="text"
              placeholder="Search files..."
              className="max-w-sm"
            />

            <Button onClick={openNotionAuthPopup}>
              {/* <a
                target="_blank"
                rel="noopener noreferrer"
                href={process.env.NEXT_PUBLIC_NOTION_AUTH_URL}
              > */}
              Conecta con Notion
              {/* </a> */}
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]">
                  <Input type="checkbox" />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Bytes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFileError && <>{getFileError.message}</>}
              {getFileloading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    <Loader />
                  </TableCell>
                </TableRow>
              ) : (
                fileData &&
                fileData.map((file: any, index: number) => (
                  <TableRow
                    key={index}
                    className={
                      file.isCharging ? "bg-slate-100 animate-pulse" : ""
                    }
                  >
                    <TableCell>
                      <Input type="checkbox" />
                    </TableCell>
                    <TableCell>{file.filename}</TableCell>
                    <TableCell>{file.bytes}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 ${file.status === "processed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} rounded-full text-xs`}
                      >
                        {file.status}
                      </span>
                    </TableCell>
                    {
                      <TableCell>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="alert"
                          onClick={() => {
                            handleDelete(file.id);
                          }}
                          disabled={file.isCharging}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </TableCell>
                    }
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
