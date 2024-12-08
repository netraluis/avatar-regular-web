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
import { Trash2, RefreshCcw, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "@/components/context/appContext";
import { Loader } from "@/components/loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileType } from "@prisma/client";
import { useGetAssistant } from "@/components/context/useAppContext/assistant";
import { useFileVectorStoreAssistant } from "@/components/context/useAppContext/file";
import { CustomCard } from "@/components/custom-card";

export default function Component() {
  const [popup, setPopup] = useState<Window | null>(null);
  const [isModalOpenNotionAuth, setIsModalOpenNotionAuth] = useState(false);
  // const [isModalAddNotionUrl, setIsModalAddNotionUrl] = useState(false);
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [invalidUrl, setInvalidUrl] = useState(false);
  const [gettingNotion, setGettingNotion] = useState(false);
  const { getAssistant, loadingGetAssistant, getAssistantData } =
    useGetAssistant();
  const {
    state: { user },
  } = useAppContext();

  const router = useRouter();

  useEffect(() => {
    // Listener para el mensaje de autenticación completada
    const handleAuthMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return; // Seguridad: verificar el origen

      if (event.data.type === "NOTION_AUTH_SUCCESS") {
        if (!getAssistantData?.localAssistant?.notionAccessToken) {
          try {
            await fetch(`/api/notion/oauth/token`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // "x-user-id": userId,
              },
              body: JSON.stringify({
                code: event.data.code,
                assistantId: params.assistantId as string,
              }),
            });

            // const data = await response.json();
          } catch (e: any) {
            setErrorCode(e.message);
          }
        }
      } else {
        console.log("Error de autenticación:", event.data.error);
      }
      if (popup && !popup.closed) {
        popup.close(); // Cierra la ventana emergente
        setPopup(null); // Limpia la referencia
      }
    };

    window.addEventListener("message", handleAuthMessage);

    return () => {
      window.removeEventListener("message", handleAuthMessage);
    };
  }, [popup]);

  const {
    upLoadFileloading,
    upLoadFileError,
    uploadFileVectorStore,
    getFileVectorStore,
    getFileloading,
    getFileError,
    deleteFileVectorStore,
    fileData,
  } = useFileVectorStoreAssistant();

  const params = useParams();

  const fetchData = async (userId: string) => {
    await getAssistant({
      assistantId: params.assistantId as string,
      userId,
      teamId: params.teamId as string,
    });
    await getFileVectorStore({
      assistantId: params.assistantId as string,
      fileType: FileType.NOTION,
      teamId: params.teamId as string,
    });
  };

  useEffect(() => {
    if (user?.user.id) {
      fetchData(user?.user?.id);
    } else {
      router.push("/login");
    }
  }, [params.assistantId]);

  const handleDelete = async (fileId: string) => {
    await deleteFileVectorStore({ fileId, teamId: params.teamId as string, assistantId: params.assistantId as string });
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
        setIsModalOpenNotionAuth(false); // Cierra el modal
      }
    }, 500);
  };

  function extractNotionId(url: string) {
    // Expresión regular para capturar 32 caracteres hexadecimales (UUID) al final de la URL antes de un posible ?v=
    const match = url.match(/([a-f0-9]{32})(\?v=[a-f0-9]{32})?$/i);

    // Si se encuentra una coincidencia, verificamos si es una base de datos
    if (match) {
      const notionId = match[1];
      const isDatabase = Boolean(match[2]); // Si ?v= está presente, es una base de datos
      return { id: notionId, type: isDatabase ? "database" : "page" };
    }

    return null; // No se encontró un ID válido
  }

  const getDatabaseJson = async (databaseId: string) => {
    try {
      const databaseResponse = await fetch(
        `/api/notion/database/${databaseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // "x-user-id": userId,
            "x-acccess-token": getAssistantData?.localAssistant
              ?.notionAccessToken as string,
          },
        },
      );

      return await databaseResponse.json();
    } catch (e: any) {
      console.log("error getting database json", e);
      return e;
    }
  };

  const getPageJson = async (pageId: string) => {
    try {
      const databaseResponse = await fetch(`/api/notion/page/${pageId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // "x-user-id": userId,
          "x-acccess-token": getAssistantData?.localAssistant
            ?.notionAccessToken as string,
        },
      });
      return await databaseResponse.json();
    } catch (e: any) {
      console.log("error getting database json", e);
      return e;
    }
  };

  const getNotionInfo = async (url: string) => {
    setGettingNotion(true);
    const notionId = extractNotionId(url);
    if (!notionId) {
      setInvalidUrl(true);
      setGettingNotion(false);
      return;
    } else {
      setInvalidUrl(false);
    }
    let dataJson;

    switch (notionId?.type) {
      case "database":
        dataJson = await getDatabaseJson(notionId.id);
        break;
      case "page":
        dataJson = await getPageJson(notionId.id);
        break;
      default:
        setInvalidUrl(true);
        break;
    }

    const jsonBlob = new Blob([JSON.stringify(dataJson, null, 2)], {
      type: "application/json",
    });
    const file = new File([jsonBlob], `${notionId.id}.json`, {
      type: "application/json",
    });
    setGettingNotion(false);
    await uploadFileVectorStore({
      fileInput: [file] as unknown as FileList,
      assistantId: params.assistantId as string,
      fileType: FileType.NOTION,
      teamId: params.teamId as string,
    });

    setInputValue("");
  };

  return (
    <>
      <div className="flex-1 p-8">
        <CustomCard
          title={"Notion"}
          description={"Nutre a tu assistente con tablas de Notion"}
        >
          <div className="flex justify-end item-end mb-4">
            {/* <Input
              type="text"
              placeholder="Search files..."
              className="max-w-sm"
            /> */}

            <Button
              disabled={loadingGetAssistant}
              onClick={() => setIsModalOpenNotionAuth(true)}
            >
              {!loadingGetAssistant ? (
                getAssistantData?.localAssistant?.notionAccessToken ? (
                  "Cambiar permisos Notion"
                ) : (
                  "Conecta con Notion"
                )
              ) : (
                <RefreshCcw className="animate-spin" />
              )}
            </Button>
          </div>
          <div className="flex justify-end items-end mb-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsAddingUrl(!isAddingUrl)}
            >
              {!isAddingUrl ? <Plus /> : <Minus />}
            </Button>
          </div>
          {errorCode && <>{errorCode}</>}
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
              {isAddingUrl && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    <div className="flex justify-between items-center mb-4">
                      <Input
                        type="text"
                        placeholder="Añadir url de Notion..."
                        className="max-w-sm"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setInputValue(e.target.value)
                        }
                      />
                      {invalidUrl && <>No se encontron un id valido</>}
                      {upLoadFileError && <>Error al subir el archivo</>}
                      {gettingNotion && <>Obteniendo la info de notion...</>}
                      {upLoadFileloading && <>Enseñando a tu IA..</>}
                      <Button
                        size="icon"
                        disabled={
                          loadingGetAssistant ||
                          gettingNotion ||
                          upLoadFileloading
                        }
                        onClick={() => getNotionInfo(inputValue)}
                      >
                        {!loadingGetAssistant &&
                        !gettingNotion &&
                        !upLoadFileloading ? (
                          <Plus />
                        ) : (
                          <RefreshCcw className="animate-spin" />
                        )}
                      </Button>
                    </div>
                    {/* {jsonData && (
                        <pre className="mt-4 p-4 bg-gray-100 rounded border border-gray-300 whitespace-pre-wrap">
                          {JSON.stringify(jsonData, null, 2)}
                        </pre>
                      )} */}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CustomCard>
      </div>
      <Dialog
        open={isModalOpenNotionAuth}
        onOpenChange={setIsModalOpenNotionAuth}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Como hacer la integración</DialogTitle>
          </DialogHeader>
          <Button onClick={openNotionAuthPopup}>Empezar el proceso</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
