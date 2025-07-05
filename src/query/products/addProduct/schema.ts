import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.string().min(1, "Preço é obrigatório"),
  imageUrl: z.string().url("URL da imagem inválida"),
  description: z.string().optional(),
});

export type AddProductSchema = z.infer<typeof addProductSchema>;
