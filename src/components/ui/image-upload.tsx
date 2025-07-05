/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { RefreshCw, Trash2Icon, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import { ExpandButton } from "../expand-button";

export const ImageUpload = ({
  onChange,
}: {
  onChange?: (files: (File | null)[]) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    const imageFile = newFiles[0] || null;
    setFile(imageFile);

    if (imageFile) onChange?.([imageFile]);
  };

  const openFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    accept: {
      "image/*": [],
    },
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <div className="p-4 group/file block rounded-lg w-full relative overflow-hidden">
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"></div>
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full mx-auto">
            {file ? (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <div
                  className={cn(
                    "relative overflow-hidden z-40 bg-card flex flex-row items-center md:h-32 p-4 w-full mx-auto rounded-md",
                    "shadow-sm"
                  )}
                >
                  <div className="w-24 h-24 flex items-center justify-center bg-card rounded-md overflow-hidden mr-4">
                    <DialogTrigger asChild>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="object-cover w-full h-full cursor-pointer"
                      />
                    </DialogTrigger>
                  </div>

                  <div className="flex flex-col justify-between h-24 flex-1">
                    <div className="flex justify-end w-full items-start gap-2">
                      <span className="px-1 py-0.5 rounded-md bg-secondary text-sm text-neutral-600 dark:text-neutral-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>

                    <div className="flex gap-2 justify-end items-end flex-1 w-full">
                      <ExpandButton
                        onClick={() => {
                          setFile(null);
                          onChange?.([null]);
                        }}
                        variant="destructive"
                        icon={<Trash2Icon />}
                        hoverText="Deletar"
                      />

                      <ExpandButton
                        variant="default"
                        onClick={openFileBrowser}
                        icon={<RefreshCw />}
                        hoverText="Trocar"
                      />
                    </div>
                  </div>
                </div>
                <DialogContent className="flex flex-col items-center justify-center">
                  <DialogTitle>Imagem selecionada</DialogTitle>

                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="max-w-full max-h-[80vh] rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            ) : (
              <div
                onClick={openFileBrowser}
                className={cn(
                  "relative cursor-pointer hover:shadow-2xl z-40 bg-card flex items-center justify-center gap-2 h-32 w-full mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                <Upload className="h-4 w-4 text-card-foreground" />
                <p>
                  {isDragActive
                    ? "Solte a imagem aqui"
                    : "Clique para selecionar uma imagem"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
