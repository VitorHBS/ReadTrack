/**
 * AUTH SERVICE
 *
 * Contém toda a lógica de autenticação.
 *
 * O que colocar aqui:
 * - Registro de usuário (register)
 * - Login
 * - Geração de token JWT
 * - Validações de autenticação
 *
 * Pode usar:
 * - userService (reutilizar createUser)
 *
 * NÃO deve ter:
 * - req ou res (isso é do controller)
 */

import JWT from "jsonwebtoken";
import { createUser } from "../services/userService.js";
import { prisma } from "../libs/prisma.js";
import type { userInput } from "../schemas/userSchema.js";
import dotenv from "dotenv";

dotenv.config()

export const register = async (data: userInput) => {

    const hasUser = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })

    if (hasUser) {
        throw new Error("E-mail já existe.")
    }

    const newUser = await createUser(data);

    const token = JWT.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "2h" }
    )

    return { id: newUser.id, token }
}