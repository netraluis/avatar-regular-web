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
import { Upload, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Loader } from "@/components/loader";
import { FileType } from "@prisma/client";
import { VectorStoreFile } from "@/types/types";
import { useFileVectorStoreAssistant } from "@/components/context/useAppContext/file";
import { CustomCard } from "@/components/custom-card";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDelete = async (fileId: string) => {
    await deleteFileVectorStore({
      fileId,
      teamId: params.teamId as string,
      assistantId: params.assistantId as string,
    });
  };

  return (
    <>
      <CustomCard title={archives.title} description={archives.description}>
        <div className="flex justify-end items-end mb-4">
          {/* <Input
            type="text"
            placeholder="Search files..."
            className="max-w-sm"
          /> */}
          <Button onClick={() => setIsModalOpen(true)}>
            + {archives.actionButton}
          </Button>
        </div>
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]">
                <Input type="checkbox" />
              </TableHead>
              <TableHead>{archives.name}</TableHead>
              <TableHead>{archives.characters}</TableHead>
              <TableHead>{archives.status}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-y-auto grow scrollbar-hidden h-full">
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
                  <TableCell>
                    <Input type="checkbox" />
                  </TableCell>
                  <TableCell>{file.filename}</TableCell>
                  <TableCell>{file.bytes}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 ${!file.isCharging ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} rounded-full text-xs`}
                    >
                      {!file.isCharging ? "uploaded" : "uploading"}
                    </span>
                  </TableCell>
                  {
                    <TableCell>
                      <Button
                        aria-haspopup="true"
                        size="icon"
                        variant="outline"
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
      </CustomCard>
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
    </>
  );
}
