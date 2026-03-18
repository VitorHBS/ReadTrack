import * as z from "zod";


export const bookSchema = z.object({
    title: z.string().min(2),
    author: z.string().min(2),
    pages: z.number(),
    status: z.enum(["READING", "COMPLETE", "PLANNED"]),
    rating: z.number().min(0).max(5).nullable()
}) 

export type  bookInput = z.infer<typeof bookSchema>


