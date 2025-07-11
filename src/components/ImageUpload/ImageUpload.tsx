/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Trash2Icon, Loader2, Plus, XIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";
import { useAsyncQueuer } from "@tanstack/react-pacer";
import { Button } from "../ui/button";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

const DRAG_SENSOR_OPTS = {
  activationConstraint: { distance: 10 },
};

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

  const sensors = useSensors(
    useSensor(PointerSensor, DRAG_SENSOR_OPTS),
    useSensor(TouchSensor, DRAG_SENSOR_OPTS),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      ...DRAG_SENSOR_OPTS,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over?.id === "trash-droppable") {
      const newItems = items.filter((item) => item.key !== active.id);
      setItems(newItems);
      onChange(itemsToUrls(newItems));
      return;
    }

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.key === active.id);
      const newIndex = items.findIndex((item) => item.key === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const newItems = arrayMove(items, oldIndex, newIndex);
      onChange(itemsToUrls(newItems));
      setItems(newItems);
    }
  }

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

  const { getRootProps, isDragActive: isDraggingFileIntoDropzone } =
    useDropzone({
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.key)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {items.map((item, index) => (
                <SortableItem key={item.key} id={item.key}>
                  <Dialog
                    open={selectedImageUrl === item.url}
                    onOpenChange={(isOpen) =>
                      setSelectedImageUrl(isOpen ? item.url : null)
                    }
                  >
                    <div
                      className={cn(
                        "relative overflow-hidden z-10 bg-accent flex flex-col items-center justify-center aspect-[2/3] w-full mx-auto rounded-md",
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
                          className="object-cover w-full h-full"
                        />
                      </DialogTrigger>
                      {item.isLoading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                      )}
                      {!item.isLoading && (
                        <div className="absolute top-1 right-1 sm:opacity-0 opacity-100 group-hover:opacity-100 transition-opacity">
                          <Button
                            onClick={removeFromList(item.url)}
                            variant="destructive"
                            size="icon"
                          >
                            <span className="sr-only">
                              Remover imagem {index + 1}
                            </span>
                            <Trash2Icon />
                          </Button>
                        </div>
                      )}
                      <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs font-extrabold size-5 flex justify-center items-center rounded-full">
                        {index + 1}
                      </div>
                    </div>
                    <DialogContent
                      showCloseButton={false}
                      className="flex flex-col items-center justify-center w-[95vw] aspect-[2/3] border-0 p-0 text-white text-shadow-lg"
                    >
                      <DialogClose
                        data-slot="dialog-close"
                        className=" absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full cursor-pointer"
                      >
                        <span className="sr-only">Fechar</span>
                        <XIcon />
                      </DialogClose>

                      <DialogTitle className="sr-only">
                        Imagem selecionada
                      </DialogTitle>
                      <DialogDescription className="sr-only">
                        Imagem selecionada em tamanho ampliado para melhor
                        visualização.
                      </DialogDescription>
                      <img
                        src={item.url}
                        alt={`upload-${item.key}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </DialogContent>
                  </Dialog>
                </SortableItem>
              ))}

              <button
                {...getRootProps()}
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Adicionar nova imagem"
                className={cn(
                  "flex items-center justify-center cursor-pointer shadow-md z-0 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors gap-2 aspect-[2/3] w-full mx-auto rounded-md",
                  isDraggingFileIntoDropzone &&
                    "border-2 border-dashed border-primary"
                )}
              >
                <Plus className="size-6" />
              </button>
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <p className="text-xs text-muted-foreground">
        Arraste as imagens para reordená-las. A imagem principal será a primeira
        da lista. Clique numa imagem para abrir em tela cheia.
      </p>
    </div>
  );
};
