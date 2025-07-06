"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useMutation,
  usePrefetchQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toastError } from "@/query/core/toastError";
import { keys } from "@/query/products/config";
import { Input } from "@/components/ui/input";
import { listTagsOptions } from "@/query/products/listTags/query";
import { upsertTagsOptions } from "@/query/products/upsertTags/mutation";
import { TagIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function UpsertTagsForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { data } = useQuery(listTagsOptions());
  const [tags, setTags] = useState<string[]>(
    data?.tags.map((t) => t.name) || []
  );
  const [inputValue, setInputValue] = useState("");

  const { mutateAsync: upsertTags, isPending } = useMutation(
    upsertTagsOptions()
  );
  const queryClient = useQueryClient();

  const handleAddTag = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsertTags({ tags });
      queryClient.invalidateQueries({ queryKey: keys.listTags });
      queryClient.invalidateQueries({ queryKey: keys.listProducts });
      setOpen(false);
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
          placeholder="Nova categoria"
        />
        <Button type="button" onClick={handleAddTag}>
          Adicionar
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-1"
            >
              <XIcon className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Button loading={isPending} type="submit" className="mt-2 w-full">
        Salvar categorias
      </Button>
    </form>
  );
}

export function UpsertTagsDialog() {
  usePrefetchQuery(listTagsOptions());
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <span className="hidden sm:block">Nova categoria</span>

          <TagIcon className="block sm:hidden" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full">
        <DialogTitle className="text-xl font-bold mb-4">
          Gerenciar categorias
        </DialogTitle>

        {open ? (
          <UpsertTagsForm setOpen={setOpen} />
        ) : (
          <div className="h-80 w-full" />
        )}
      </DialogContent>
    </Dialog>
  );
}
