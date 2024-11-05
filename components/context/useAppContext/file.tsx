import { SuccessfullResponse, VectorStoreFile } from "@/types/types";
import { FileType } from "@prisma/client";
import { useState } from "react";

export const useFileVectorStoreAssistant = () => {
  const [upLoadFileloading, setUpLoadFileloading] = useState(false);
  const [upLoadFileError, setUpLoadFileError] = useState<any>(null);
  const [upLoadFiledata, setUpLoadFiledata] = useState<any>(null);

  const [getFileloading, setGetFileloading] = useState(false);
  const [getFileError, setGetFileError] = useState<any>(null);
  const [getFileData, setGetFiledata] = useState<
    SuccessfullResponse<VectorStoreFile[]>
  >({ status: 200, data: [] });

  const [fileData, setFileData] = useState<VectorStoreFile[]>([]);

  async function uploadFileVectorStore({
    fileInput,
    assistantId,
    fileType,
  }: {
    fileInput: FileList | null;
    assistantId: string;
    fileType: FileType;
  }) {
    if (!fileInput || fileInput.length === 0) return;
    try {
      setUpLoadFileloading(true);

      const upLoadingFile: any[] = [
        ...Array.from(fileInput).map((file) => {
          return {
            filename: file.name,
            isCharging: true,
            status: "loading",
          };
        }),
      ];

      setFileData((prev) => [...prev, ...upLoadingFile]);
      const formData = new FormData();
      Array.from(fileInput).forEach((file) => {
        formData.append("files", file); // Usa el mismo nombre "files" para todos los archivos
      });

      formData.append("assistantId", assistantId);
      formData.append("purpose", "assistants");

      const requestOptions = { method: "POST", body: formData };

      const response = await fetch(
        `/api/protected/file/file-type/${fileType}`,
        requestOptions,
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();
      setUpLoadFileError(null);
      setUpLoadFiledata(responseData);
      console.log({ responseData });
      setFileData((prev) => prev.filter((file) => !file.isCharging));
      return setFileData((prev) => [
        ...prev.filter((file) => !file.isCharging),
        ...responseData.data,
      ]);
    } catch (error: any) {
      return setUpLoadFileError({ error });
    } finally {
      setUpLoadFileloading(false);
    }
  }

  async function getFileVectorStore({
    assistantId,
    fileType,
  }: {
    assistantId: string;
    fileType: FileType;
  }) {
    try {
      setGetFileloading(true);
      const response = await fetch(
        `/api/protected/file/file-type/${fileType}/${assistantId}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData: SuccessfullResponse<VectorStoreFile[]> =
        await response.json();
      setGetFiledata(responseData);
      console.log("GET", { responseData });
      return setFileData(responseData.data);
    } catch (error: any) {
      return setGetFileError({ error });
    } finally {
      setGetFileloading(false);
    }
  }

  async function deleteFileVectorStore({ fileId }: { fileId: string }) {
    try {
      setFileData((pre) => {
        const res = pre.map((file) => {
          if (file.id === fileId) {
            return { ...file, isCharging: true };
          }
          return file;
        });
        return res;
      });
      const response = await fetch(`/api/protected/file/${fileId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return setFileData((pre) => pre.filter((file) => file.id !== fileId));
    } catch (error: any) {
      return setFileData((pre) => {
        const res = pre.map((file) => {
          if (file.id === fileId) {
            return { ...file, isCharging: false, status: "error" };
          }
          return file;
        });
        return res;
      });
    } finally {
      setFileData((pre) => {
        const res = pre.map((file) => {
          if (file.id === fileId) {
            return { ...file, isCharging: false };
          }
          return file;
        });
        return res;
      });
    }
  }

  return {
    upLoadFileloading,
    upLoadFileError,
    upLoadFiledata,
    uploadFileVectorStore,
    getFileloading,
    getFileError,
    getFileData,
    getFileVectorStore,
    deleteFileVectorStore,
    fileData,
  };
};
