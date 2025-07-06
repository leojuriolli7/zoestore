"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProductOptions } from "@/query/products/addProduct/mutation";
import { upload } from "@vercel/blob/client";
import { toastError } from "@/query/core/toastError";
import { keys } from "@/query/products/config";
import { appConfig } from "@/config";
import { updateProductOptions } from "@/query/products/updateProduct/mutation";
import { useUpertProductStore } from "./store";
import { formSchema, FormSchema } from "./schema";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "lucide-react";
import { TagsSelector } from "./TagsSelector";

function UpsertProductForm() {
  const { setOpen, product } = useUpertProductStore();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description || undefined,
          price: product?.price,
          image: product?.imageFile,
          tags: product?.tags.map((t) => t.name),
        }
      : {
          name: "",
          price: "",
          image: undefined,
          description: "",
          tags: [],
        },
  });

  const { mutateAsync: addProduct } = useMutation(addProductOptions());

  const { mutateAsync: updateProduct } = useMutation(
    updateProductOptions(product?.slug as string)
  );
  const queryClient = useQueryClient();

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: FormSchema) => {
    const imageFile = data.image as File;

    /** Has a product, so it's an update flow. */
    if (product) {
      let newImageUrl = product.image_url;

      try {
        if (imageFile.name === appConfig.images.updateImageName) {
          const { url } = await upload(imageFile.name, imageFile, {
            access: "public",
            handleUploadUrl: "/api/uploads/image",
          });

          newImageUrl = url;
        }

        await updateProduct({
          imageUrl: newImageUrl,
          name: data.name,
          price: data.price,
          description: data?.description,
          tags: data.tags,
        });
      } catch (error) {
        toastError(error);
      }
    }

    /** Creation flow: */
    if (!product) {
      try {
        const { url } = await upload(imageFile.name, imageFile, {
          access: "public",
          handleUploadUrl: "/api/uploads/image",
        });

        await addProduct({
          imageUrl: url,
          name: data.name,
          price: data.price,
          description: data?.description,
          tags: data.tags,
        });
      } catch (error) {
        toastError(error);
      }
    }

    setOpen(false);
    form.reset();

    queryClient.invalidateQueries({
      queryKey: keys.listProducts,
      exact: false,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
        autoComplete="off"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nome</Label>

          {form.formState.errors.name && (
            <span className="text-sm text-red-500">
              {form.formState.errors.name.message}
            </span>
          )}

          <Input
            id="name"
            {...form.register("name")}
            placeholder="Nome do produto"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Preço</Label>

          {form.formState.errors.price && (
            <span className="text-sm text-red-500">
              {form.formState.errors.price.message}
            </span>
          )}

          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium border-r pr-1">
              R$
            </div>

            <Input
              id="price"
              {...form.register("price")}
              /** Replace comma with dot to ensure validation is consistent. Most `decimal` mobile keyboard render commas. */
              onInput={(event) => {
                event.currentTarget.value = event.currentTarget.value.replace(
                  /,/g,
                  "."
                );
              }}
              onBlur={(event) => {
                const value = Number(event.currentTarget.value);

                if (isNaN(value)) {
                  event.currentTarget.value = "";
                } else {
                  event.currentTarget.value = value.toFixed(2);
                }
              }}
              className="pl-11"
              inputMode="decimal"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="image">
            Imagem
            <span className="text-xs text-muted-foreground">
              (Aspecto recomendado: 2/3)
            </span>
          </Label>

          {form.formState.errors.image && (
            <span className="text-sm text-red-500">
              {form.formState.errors.image.message as string}
            </span>
          )}

          <Controller
            control={form.control}
            name="image"
            render={({ field }) => (
              <ImageUpload
                defaultValue={product?.imageFile}
                onChange={(files) => {
                  field.onChange(files[0]);
                }}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="tags">
            Categorias
            <span className="text-xs text-muted-foreground">(Opcional)</span>
          </Label>

          <Controller
            control={form.control}
            name="tags"
            render={({ field }) => (
              <TagsSelector
                value={field.value || []}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">
            Descrição
            <span className="text-xs text-muted-foreground">(Opcional)</span>
          </Label>

          {form.formState.errors.description && (
            <span className="text-sm text-red-500">
              {form.formState.errors.description.message}
            </span>
          )}

          <Textarea
            id="description"
            {...form.register("description")}
            placeholder="Descrição do produto"
          />
        </div>

        <Button loading={isSubmitting} type="submit" className="mt-2 w-full">
          {product ? "Atualizar produto" : "Adicionar Produto"}
        </Button>
      </form>
    </Form>
  );
}

export function UpsertProductDialog() {
  const { setOpen, open, product } = useUpertProductStore();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <span className="hidden sm:block">Adicionar produto</span>

          <PlusIcon className="block sm:hidden" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full">
        <DialogTitle className="text-xl font-bold mb-4">
          {product ? "Atualizar produto" : "Adicionar produto"}
        </DialogTitle>

        {open ? <UpsertProductForm /> : <div className="h-80 w-full" />}
      </DialogContent>
    </Dialog>
  );
}
