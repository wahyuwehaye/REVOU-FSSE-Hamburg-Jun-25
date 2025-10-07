import { z } from "zod";

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  images: z.array(z.string().url()).nonempty(),
  category: categorySchema,
});

export const productsSchema = z.array(productSchema);

export type ProductZod = z.infer<typeof productSchema>;
