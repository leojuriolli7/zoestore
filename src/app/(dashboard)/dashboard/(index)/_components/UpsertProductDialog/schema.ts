import z from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Preço deve ser um número positivo",
  }),
  medias: z.array(z.string()).min(1, "Envie ao menos uma mídia"),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type FormSchema = z.infer<typeof formSchema>;
