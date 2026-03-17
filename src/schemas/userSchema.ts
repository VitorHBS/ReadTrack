import * as z from "zod"

export const userSchema = z.object({
    email: z.email(),
    name: z.string().min(2).max(40).optional(),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
})

export type  userInput = z.infer<typeof userSchema>