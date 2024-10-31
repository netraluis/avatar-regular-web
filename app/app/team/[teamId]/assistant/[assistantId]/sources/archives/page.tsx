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
import { useFileVectorStoreAssistant } from "@/components/context/appContext";
import { Loader } from "@/components/loader";

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
    await getFileVectorStore({ assistantId: params.assistantId as string });
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
    });
    setIsModalOpen(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = async (fileId: string) => {
    await deleteFileVectorStore({ fileId });
  };

  return (
    <>
      <div className="flex-1 p-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Files</h1>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Drag & drop files here, or click to select files (Supported File
            Types: .pdf, .doc, .docx, .txt)
          </p>
          <div className="flex justify-between items-center mb-4">
            <Input
              type="text"
              placeholder="Search files..."
              className="max-w-sm"
            />
            <Button onClick={() => setIsModalOpen(true)}>+ Upload file</Button>
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
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
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
                  Drag and drop your files here, or{" "}
                  <label className="text-primary hover:underline cursor-pointer">
                    browse
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={async (e) => {
                        await uploadFileVectorStore({
                          fileInput: e.target.files,
                          assistantId: params.assistantId as string,
                        });
                        setIsModalOpen(false);
                      }}
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-400">
                  Supported files: PDF, DOC, DOCX, TXT
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
