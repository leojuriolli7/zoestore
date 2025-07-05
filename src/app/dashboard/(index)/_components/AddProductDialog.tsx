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
import { z } from "zod";
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

const MAX_UPLOAD_SIZE = 1024 * 1024 * 20;

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Preço deve ser um número positivo",
  }),
  image:
    typeof window === "undefined"
      ? z.any()
      : z
          .instanceof(File, { message: "Envie um arquivo válido" })
          .refine(
            (file) => file.size <= MAX_UPLOAD_SIZE,
            `Tamanho máximo de 20MB`
          )
          .refine(
            (file) => file.type.includes("image"),
            `Envie um arquivo de imagem`
          ),
  description: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export function AddProductDialog() {
  const [open, setOpen] = React.useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
      image: undefined,
      description: "",
    },
  });

  const { mutateAsync: addProduct } = useMutation(addProductOptions());
  const queryClient = useQueryClient();

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: FormSchema) => {
    const imageFile = data.image as File;

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
      });

      setOpen(false);
      form.reset();

      queryClient.invalidateQueries({
        queryKey: keys.listProducts,
        exact: false,
      });
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">Novo Produto</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl! w-full">
        <DialogTitle className="text-xl font-bold mb-4">
          Adicionar Produto
        </DialogTitle>

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
                  onBlur={(event) => {
                    const value = Number(event.currentTarget.value);

                    if (isNaN(value)) {
                      event.currentTarget.value = "";
                    }

                    if (!isNaN(value)) {
                      event.currentTarget.value = value.toFixed(2);
                    }
                  }}
                  className="pl-11"
                  inputMode="decimal"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="image">Imagem</Label>

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
                    onChange={(files) => {
                      field.onChange(files[0]);
                    }}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">
                Descrição{" "}
                <span className="text-xs text-neutral-400">(Opcional)</span>
              </Label>

              {form.formState.errors.description && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.description.message}
                </span>
              )}

              <Input
                id="description"
                {...form.register("description")}
                placeholder="Descrição do produto"
              />
            </div>

            <Button
              loading={isSubmitting}
              type="submit"
              className="mt-2 w-full"
            >
              Adicionar Produto
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
