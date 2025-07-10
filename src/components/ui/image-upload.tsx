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

function itemsToUrls(items: UploadItem[]): string[] {
  return items.map((item) => item.url);
}

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

  const [draggedItem, setDraggedItem] = useState<UploadItem | null>(null);
  const [draggedOverItemKey, setDraggedOverItemKey] = useState<string | null>(
    null
  );

  const uploadQueuer = useAsyncQueuer(
    async (task: UploadTask) => {
      if (!task.item.file) throw new Error("No file to upload.");

      const blob = await upload(task.item.file.name, task.item.file, {
        access: "public",
        handleUploadUrl: "/api/uploads/image",
      });

      function updateFinishedItem(item: UploadItem): UploadItem {
        return {
          ...item,
          url: blob.url,
          isLoading: false,
          file: undefined,
        };
      }

      setItems((prev) =>
        prev.map((item) =>
          item.key === task.tempKey ? updateFinishedItem(item) : item
        )
      );

      return {
        ...task,
        item: updateFinishedItem(task.item),
      };
    },

    {
      concurrency: 3,
      started: true,
      onSuccess: (finishedTask) => {
        onChange(
          items.map((item) => {
            if (item.key === finishedTask.tempKey) {
              return finishedTask.item.url;
            }

            return item.url;
          })
        );
      },
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

  const handleDragStart = (item: UploadItem) => {
    setDraggedItem(item);
  };

  const handleDragEnter = (item: UploadItem) => {
    setDraggedOverItemKey(item.key);
  };

  const handleDrop = () => {
    if (!draggedItem || !draggedOverItemKey) return;

    const dragItemIndex = items.findIndex(
      (item) => item.key === draggedItem.key
    );

    const dragOverItemIndex = items.findIndex(
      (item) => item.key === draggedOverItemKey
    );

    if (
      dragItemIndex === -1 ||
      dragOverItemIndex === -1 ||
      dragItemIndex === dragOverItemIndex
    ) {
      return;
    }

    const newItems = [...items];
    const [removed] = newItems.splice(dragItemIndex, 1);
    newItems.splice(dragOverItemIndex, 0, removed);

    setItems(newItems);
    onChange(itemsToUrls(newItems));
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedOverItemKey(null);
  };

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
    onChange?.(itemsToUrls(newItems));
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
          {items.map((item, index) => (
            <Dialog
              key={item.key}
              open={selectedImageUrl === item.url}
              onOpenChange={(isOpen) =>
                setSelectedImageUrl(isOpen ? item.url : null)
              }
            >
              <div
                draggable={!item.isLoading}
                onDragStart={() => handleDragStart(item)}
                onDragEnter={() => handleDragEnter(item)}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={cn(
                  "relative overflow-hidden z-10 bg-accent flex flex-col items-center justify-center h-32 w-full mx-auto rounded-md",
                  "shadow-sm group",
                  draggedOverItemKey === item.key && "border-2 border-primary"
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
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs font-extrabold size-5 flex justify-center items-center rounded-full">
                  {index + 1}
                </div>
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
      <p className="text-xs text-muted-foreground">
        Arraste as imagens para reordená-las. A imagem principal será a primeira
        da lista.
      </p>
    </div>
  );
};
