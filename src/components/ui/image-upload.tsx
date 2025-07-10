/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Trash2Icon, Loader2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";
import { useAsyncQueuer } from "@tanstack/react-pacer";
import { Button } from "./button";

type UploadItem = {
  key: string;
  url: string;
  file?: File;
  isLoading: boolean;
};

type UploadTask = {
  item: UploadItem;
  tempKey: string;
};

type ImageUploadProps = {
  onChange: (urls: string[]) => void;
  defaultValue: string[];
};

export const ImageUpload = ({
  onChange,
  defaultValue = [],
}: ImageUploadProps) => {
  const [items, setItems] = useState<UploadItem[]>(
    defaultValue.map((url) => ({
      key: url,
      url,
      isLoading: false,
    }))
  );

  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadQueuer = useAsyncQueuer(
    async (task: UploadTask) => {
      if (!task.item.file) throw new Error("No file to upload.");

      const blob = await upload(task.item.file.name, task.item.file, {
        access: "public",
        handleUploadUrl: "/api/uploads/image",
      });

      setItems((prev) => {
        const newItems = prev.map((item) =>
          item.key === task.tempKey
            ? {
                ...item,
                url: blob.url,
                isLoading: false,
                file: undefined,
              }
            : item
        );

        onChange(newItems.map((item) => item.url));
        return newItems;
      });
    },
    {
      concurrency: 3,
      started: true,
      onError: (_, queuer) => {
        const activeItems = queuer.peekActiveItems();

        if (activeItems.length > 0) {
          const failedTask = activeItems[0];

          setItems((prev) =>
            prev.filter((item) => item.key !== failedTask.tempKey)
          );

          toast.error(
            `Falha ao enviar ${failedTask.item.file?.name || "imagem"}`
          );
        }
      },
    }
  );

  const startUploadingFiles = (files: File[]) => {
    const newUploadItems: UploadItem[] = files.map((file) => ({
      key: `${file.name}${Math.random().toString(36).substring(2, 15)}`,
      url: URL.createObjectURL(file),
      file,
      isLoading: true,
    }));

    setItems((prev) => [...prev, ...newUploadItems]);

    newUploadItems.forEach((item) => {
      uploadQueuer.addItem({
        item,
        tempKey: item.key,
      });
    });
  };

  const removeFromList = (urlToRemove: string) => () => {
    const newItems = items.filter((item) => item.url !== urlToRemove);
    setItems(newItems);
    onChange?.(newItems.map((item) => item.url));
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    accept: { "image/*": [] },
    onDropAccepted: startUploadingFiles,
  });

  return (
    <div className="w-full">
      <div className="p-2 group/file block rounded-lg w-full relative overflow-hidden">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) =>
            startUploadingFiles(Array.from(e.target.files || []))
          }
          className="hidden"
        />
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <Dialog
              key={item.key}
              open={selectedImageUrl === item.url}
              onOpenChange={(isOpen) =>
                setSelectedImageUrl(isOpen ? item.url : null)
              }
            >
              <div
                className={cn(
                  "relative overflow-hidden z-10 bg-accent flex flex-col items-center justify-center h-32 w-full mx-auto rounded-md",
                  "shadow-sm group"
                )}
              >
                <DialogTrigger
                  asChild
                  onClick={() => setSelectedImageUrl(item.url)}
                >
                  <img
                    src={item.url}
                    alt={`upload-${item.key}`}
                    className="object-cover w-full h-full cursor-pointer"
                  />
                </DialogTrigger>
                {item.isLoading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
                {!item.isLoading && (
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={removeFromList(item.url)}
                      variant="destructive"
                      size="icon"
                    >
                      <span className="sr-only">Remover imagem</span>
                      <Trash2Icon />
                    </Button>
                  </div>
                )}
              </div>
              <DialogContent className="flex flex-col items-center justify-center">
                <DialogTitle>Imagem selecionada</DialogTitle>
                <img
                  src={item.url}
                  alt={`upload-${item.key}`}
                  className="max-w-full max-h-[80vh] aspect-[2/3] object-cover rounded-lg"
                />
              </DialogContent>
            </Dialog>
          ))}
          <div
            {...getRootProps()}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex items-center justify-center cursor-pointer shadow-md z-0 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors gap-2 h-32 w-full mx-auto rounded-md",
              isDragActive && "border-2 border-dashed border-primary"
            )}
          >
            <Plus className="size-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
