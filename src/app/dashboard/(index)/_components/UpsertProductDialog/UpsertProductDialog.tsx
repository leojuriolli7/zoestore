"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>

              <FormControl>
                <Input placeholder="Nome do produto" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium border-r pr-1">
                    R$
                  </div>

                  <Input
                    {...field}
                    onInput={(event) => {
                      event.currentTarget.value =
                        event.currentTarget.value.replace(/,/g, ".");
                      field.onChange(event.currentTarget.value);
                    }}
                    onBlur={(event) => {
                      field.onBlur();
                      const value = Number(event.currentTarget.value);

                      if (isNaN(value)) {
                        event.currentTarget.value = "";
                        field.onChange("");
                      } else {
                        const formattedValue = value.toFixed(2);
                        event.currentTarget.value = formattedValue;
                        field.onChange(formattedValue);
                      }
                    }}
                    className="pl-11"
                    inputMode="decimal"
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Imagem
                <span className="text-xs text-muted-foreground">
                  (Aspecto recomendado: 2/3)
                </span>
              </FormLabel>
              <FormControl>
                <ImageUpload
                  defaultValue={product?.imageFile}
                  onChange={(files) => {
                    field.onChange(files[0]);
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Categorias
                <span className="text-xs text-muted-foreground">
                  (Opcional)
                </span>
              </FormLabel>

              <FormControl>
                <TagsSelector
                  value={field.value || []}
                  onChange={field.onChange}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Descrição
                <span className="text-xs text-muted-foreground">
                  (Opcional)
                </span>
              </FormLabel>

              <FormControl>
                <Textarea
                  placeholder="Descrição do produto"
                  {...field}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      (event.metaKey || event.ctrlKey)
                    ) {
                      event.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

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
