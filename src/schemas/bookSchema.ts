import * as z from "zod";

export const bookSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Título é obrigatório")
        .max(100, "Título muito longo"),

    author: z
        .string()
        .trim()
        .min(2)
        .max(100)
        .refine((val: string) => /[a-zA-ZÀ-ÿ]/.test(val), {
            message: "Autor deve conter letras"
        }),

    pages: z
        .coerce.number()
        .int("Páginas deve ser um número inteiro")
        .positive("Páginas deve ser maior que 0"),

    status: z.enum(["READING", "COMPLETE", "PLANNED"]),

    rating: z
        .coerce.number()
        .min(0, "Nota mínima é 0")
        .max(5, "Nota máxima é 5")
        .nullable()
        .optional()
});

export const bookUpdateSchema = bookSchema.partial();

export type bookInput = z.infer<typeof bookSchema>;
export type bookUpdateInput = z.infer<typeof bookUpdateSchema>;