import z from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 20;

export const formSchema = z.object({
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
  tags: z.array(z.string()).optional(),
});

export type FormSchema = z.infer<typeof formSchema>;
