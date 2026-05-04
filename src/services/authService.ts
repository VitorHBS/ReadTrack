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
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid'

dotenv.config()

const refreshToken: Record<string, string> = {}


export const generateRefreshToken = async (userId: string) => {
    
    const token = uuidv4();
    refreshToken[token] = userId;

    Object.keys(refreshToken).forEach(t => {
        if(t !== token && refreshToken[t] == userId){
            delete refreshToken[t]
        }
    })

    setTimeout(() => delete refreshToken[token], parseInt(process.env.REFRESH_EXPIRES as string));
    return token
}



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


export const login = async (data: userInput) => {

    

    const user = await prisma.user.findUnique({
        where: {
            email: data.email,
        }
    })

    if (!user) {
        throw new Error("Credenciais inválidas antes do decoded");
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if(!passwordMatch){
        throw new Error("Credenciais inválidas bcrypt")
    }

    const token = JWT.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "2h" }
    )

    const refreshToken = await generateRefreshToken(user.id.toString())

    console.log(token, refreshToken)

    return { token, refreshToken }

}