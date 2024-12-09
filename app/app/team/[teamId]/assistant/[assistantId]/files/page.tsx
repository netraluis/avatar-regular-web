"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { Loader } from "@/components/loader";
import { FileType } from "@prisma/client";
import { VectorStoreFile } from "@/types/types";
import { useFileVectorStoreAssistant } from "@/components/context/useAppContext/file";
import OnboardingBase from "@/components/onboarding/onboarding-base";

const newInstructions = {
  title: "Escriu les instruccions del teu assistent",
  description:
    "Defineix com vols que el teu assistent funcioni. Escriu les indicacions clares i específiques que guiaran les seves respostes per assegurar una experiència personalitzada i coherent.",
  backActionText: "Enrere",
  nextActionText: "Continuar",
  subName:
    "Recorda: unes bones instruccions són clau per a un assistent eficaç! ",
  errorText: "Error al crear les instruccions",
  placeholder: "Escriu les instruccions aquí",
};
const archives = {
  title: "Fitxers",
  description:
    "Sel·lecciona els  arxius per entrenar l’assistent. (Tipus de fitxers compatibles: .pdf, .doc, .docx, .txt)",
  actionButton: "Carrega un fitxer",
  name: "Nom",
  characters: "Caràcters",
  status: "Estat",
  textDragAndDrop: "Arrossega i deixa anar els fitxers aquí o",
  browser: "explora",
  supportedFiles: "Fitxers admesos: PDF, DOC, DOCX, TXT",
};


export default function Component() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const {
    upLoadFileloading,
    upLoadFileError,
    uploadFileVectorStore,
    getFileVectorStore,
    getFileloading,
    getFileError,
    // deleteFileVectorStore,
    fileData,
  } = useFileVectorStoreAssistant();

  const params = useParams();

  const fetchData = async () => {
    await getFileVectorStore({
      assistantId: params.assistantId as string,
      fileType: FileType.FILE,
      teamId: params.teamId as string,
    });
  };

  useEffect(() => {
    fetchData();
  }, [params.assistantId]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle the dropped files
    const files = Array.from(e.dataTransfer.files);
    await uploadFileVectorStore({
      fileInput: files as unknown as FileList,
      assistantId: params.assistantId as string,
      fileType: FileType.FILE,
      teamId: params.teamId as string,
    });
    setIsModalOpen(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // const handleDelete = async (fileId: string) => {
  //   await deleteFileVectorStore({ fileId });
  // };

  const nextAction = async () => {
    router.push(
      `/team/${params.teamId}/assistant/${params.assistantId}/playground`,
    );
  };

  const backAction = () => {
    router.push(
      `/team/${params.teamId}/assistant/${params.assistantId}/playground`,
    );
  };

  return (
    <OnboardingBase
      title={newInstructions.title}
      description={newInstructions.description}
      backAction={backAction}
      nextAction={nextAction}
      backActionText={newInstructions.backActionText}
      nextActionText={newInstructions.nextActionText}
      loading={false}
      backActionActive={true}
      nextActionActive={fileData.length > 0}
      error={false}
      errorText={newInstructions.errorText}
    >
      <div className="space-y-2">
        <div className="py-1 space-y-1">
          <div className="flex justify-start items-end mb-4">
            {/* <Input
            type="text"
            placeholder="Search files..."
            className="max-w-sm"
          /> */}
            <Button onClick={() => setIsModalOpen(true)}>Pujar arxiu</Button>
          </div>
          <div className="h-64 overflow-auto flex flex-col scrollbar-hidden">
            <div>
              {fileData.length > 0 && (
                <Table className="scrollbar-hidden">
                  <TableHeader>
                    <TableRow>
                      {/* <TableHead className="w-[30px]">
                <Input type="checkbox" />
              </TableHead> */}
                      <TableHead>{archives.name}</TableHead>
                      {/* <TableHead>Bytes</TableHead> */}
                      <TableHead>{archives.status}</TableHead>
                      {/* <TableHead className="text-right"></TableHead> */}
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
                      fileData.map((file: VectorStoreFile, index: number) => (
                        <TableRow
                          key={index}
                          className={
                            file.isCharging ? "bg-slate-100 animate-pulse" : ""
                          }
                        >
                          {/* <TableCell>
                    <Input type="checkbox" />
                  </TableCell> */}
                          <TableCell>{file.filename}</TableCell>
                          {/* <TableCell>{file.bytes}</TableCell> */}
                          <TableCell>
                            <span
                              className={`px-2 py-1 ${!file.isCharging ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} rounded-full text-xs`}
                            >
                              {!file.isCharging ? "uploaded" : "uploading"}
                            </span>
                          </TableCell>
                          {
                            // <TableCell>
                            //   <Button
                            //     aria-haspopup="true"
                            //     size="icon"
                            //     variant="alert"
                            //     onClick={() => {
                            //       handleDelete(file.id);
                            //     }}
                            //     disabled={file.isCharging}
                            //   >
                            //     <Trash2 className="h-4 w-4" />
                            //     <span className="sr-only">Toggle menu</span>
                            //   </Button>
                            // </TableCell>
                          }
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{archives.actionButton}</DialogTitle>
          </DialogHeader>
          {upLoadFileError && <>{upLoadFileError.message}</>}
          {upLoadFileloading ? (
            <Loader />
          ) : (
            <div
              className={cn(
                "mt-4 border-2 border-dashed rounded-lg p-8 text-center",
                isDragging ? "border-primary bg-primary/10" : "border-gray-200",
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {archives.textDragAndDrop}{" "}
                  <label className="text-primary hover:underline cursor-pointer">
                    browse
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={async (e) => {
                        setIsModalOpen(false);
                        await uploadFileVectorStore({
                          fileInput: e.target.files,
                          assistantId: params.assistantId as string,
                          fileType: FileType.FILE,
                          teamId: params.teamId as string,
                        });
                      }}
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-400">
                  {archives.supportedFiles}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </OnboardingBase>
  );
}
