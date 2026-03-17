import * as z from "zod";


export const bookSchema = z.object({
    title: z.string().min(2),
    author: z.string().min(2),
    pages: z.number(),
    status: z.enum(["READING", "COMPLETE", "PLANNED"]),
    rating: z.number().min(0).max(5).nullable()
}) 

export type  bookInput = z.infer<typeof bookSchema>


export const userSchema = z.object({
    email: z.email(),
    name: z.string().min(2).max(40).optional(),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
})

export type  userInput = z.infer<typeof bookSchema>