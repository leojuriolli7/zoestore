import { z } from "zod";

export const updateProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  price: z.string().min(1, "Preço é obrigatório").optional(),
  imageUrl: z.string().url("URL da imagem inválida").optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
