import {
  FileUserImageType,
  SuccessfullResponse,
  VectorStoreFile,
} from "@/types/types";
import { FileType } from "@prisma/client";
import { useState } from "react";
import { useAppContext } from "../appContext";

export const useFileVectorStoreAssistant = () => {
  const [upLoadFileloading, setUpLoadFileloading] = useState(false);
  const [upLoadFileError, setUpLoadFileError] = useState<any>(null);

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
    teamId,
  }: {
    fileInput: FileList | null;
    assistantId: string;
    fileType: FileType;
    teamId: string;
  }) {
    if (!fileInput || fileInput.length === 0) return;

    try {
      setUpLoadFileloading(true);

      // Add all files to the state with an initial 'loading' status
      const initialFiles = Array.from(fileInput).map((file) => ({
        id: file.name, // Unique identifier (use name, size, or a custom UUID)
        filename: file.name,
        isCharging: true,
        status: "loading",
      }));

      setFileData((prev: any) => [...prev, ...initialFiles]);

      // Process each file independently
      const uploadPromises = Array.from(fileInput).map(async (file) => {
        const formData = new FormData();
        formData.append("files", file);
        formData.append("assistantId", assistantId);
        formData.append("purpose", "assistants");

        try {
          const response = await fetch(
            `/api/protected/team/${teamId}/assistant/${assistantId}/file/file-type/${fileType}`,
            {
              method: "POST",
              body: formData,
            },
          );

          if (!response.ok) {
            throw new Error(
              `Error uploading ${file.name}: ${response.statusText}`,
            );
          }

          const responseData = await response.json();

          // Update the specific file's state on success
          setFileData((prev) =>
            prev.map((f) =>
              f.id === file.name
                ? {
                    ...f,
                    isCharging: false,
                    status: "success",
                    ...responseData.data,
                  }
                : f,
            ),
          );
        } catch (error) {
          // Update the specific file's state on failure
          setFileData((prev) =>
            prev.map((f) =>
              f.id === file.name
                ? { ...f, isCharging: false, status: "error" }
                : f,
            ),
          );
        }
      });

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);

      setUpLoadFileError(null); // Reset error if all succeeded
    } catch (error) {
      setUpLoadFileError(error);
    } finally {
      setUpLoadFileloading(false); // End loading state
    }
  }

  async function getFileVectorStore({
    assistantId,
    fileType,
    teamId,
  }: {
    assistantId: string;
    fileType: FileType;
    teamId: string;
  }) {
    try {
      setGetFileloading(true);
      const response = await fetch(
        `/api/protected/team/${teamId}/assistant/${assistantId}/file/file-type/${fileType}`,
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
      return setFileData(responseData.data);
    } catch (error: any) {
      return setGetFileError({ error });
    } finally {
      setGetFileloading(false);
    }
  }

  async function deleteFileVectorStore({
    fileId,
    teamId,
    assistantId,
  }: {
    fileId: string;
    teamId: string;
    assistantId: string;
  }) {
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
      const response = await fetch(
        `/api/protected/team/${teamId}/assistant/${assistantId}/file/${fileId}`,
        {
          method: "DELETE",
        },
      );

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
    uploadFileVectorStore,
    getFileloading,
    getFileError,
    getFileData,
    getFileVectorStore,
    deleteFileVectorStore,
    fileData,
  };
};

export const useSupabaseFile = () => {
  const { dispatch } = useAppContext();

  const [upLoadSupabaseFileloading, setUpLoadSupabaseFileloading] =
    useState(false);
  const [upLoadSupabaseFileError, setUpLoadSupabaseFileError] =
    useState<any>(null);
  const [upLoadSupabaseFileData, setUpLoadSupabaseFileData] =
    useState<any>(null);

  async function uploadSupaseFile({
    fileInput,
    userId,
    teamId,
    fileUserImageType,
    oldUrl,
    // fileType,
  }: {
    fileInput: FileList | null;
    userId: string;
    teamId: string;
    fileUserImageType: FileUserImageType;
    assistantId?: string;
    oldUrl: string;
    // fileType: FileType;
  }) {
    const name = oldUrl.split("/")[oldUrl.split("/").length - 1];

    try {
      setUpLoadSupabaseFileloading(true);

      const formData = new FormData();
      formData.append("teamId", teamId);
      formData.append("fileUserImageType", fileUserImageType);
      formData.append("oldNameDoc", name);

      if (!fileInput || fileInput.length === 0) {
        const requestOptions = {
          method: "DELETE",
          body: formData,
          headers: {
            // "Content-Type": "application/json",
            "x-user-id": userId,
          },
        };

        return await fetch(
          `/api/protected/team/${teamId}/file/supabase`,
          requestOptions,
        );
      }
      Array.from(fileInput).forEach((file) => {
        formData.append("files", file); // Usa el mismo nombre "files" para todos los archivos
      });

      // formData.append("purpose", "assistants");

      const requestOptions = {
        method: "POST",
        body: formData,
        headers: {
          // "Content-Type": "application/json",
          "x-user-id": userId,
        },
      };

      const response = await fetch(
        `/api/protected/team/${teamId}/file/supabase`,
        requestOptions,
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const responseData = await response.json();
      setUpLoadSupabaseFileError(null);
      setUpLoadSupabaseFileData(responseData.data);
      dispatch({
        type: "SET_TEAM_SELECTED",
        payload: responseData.data,
      });
      return responseData;
    } catch (error: any) {
      return setUpLoadSupabaseFileError({ error });
    } finally {
      setUpLoadSupabaseFileloading(false);
    }
  }

  return {
    uploadSupaseFile,
    upLoadSupabaseFileloading,
    upLoadSupabaseFileError,
    upLoadSupabaseFileData,
  };
};
