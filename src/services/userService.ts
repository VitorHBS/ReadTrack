import { prisma } from "../libs/prisma.js";
import type { userInput } from "../schemas/userSchema.js";
import bcrypt from "bcrypt"


/**
 * USER SERVICE
 *
 * Responsável por operações diretas com o usuário no banco.
 *
 * O que colocar aqui:
 * - Criar usuário
 * - Buscar usuário
 * - Atualizar usuário
 * - Deletar usuário
 *
 * O que NÃO colocar:
 * - JWT
 * - Login
 * - Regras de autenticação
 */

/*  -------------------------- Criação -------------------------- */

export const createUser = async (data: userInput) => {

    const hasedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
        data: {
            email: data.email,
            password: hasedPassword,
            name: data.name ?? null
        }
    })
}


/*  -------------------------- Listagem -------------------------- */

export const getAllUser = async () => {
    return await prisma.user.findMany()
}

/*  -------------------------- Exclusão -------------------------- */

export const deleteUser = async (userId: number) => {


    const user = prisma.user.findUnique({ where: { id: userId}})


    if(!user){
        throw new Error("Usuário não existe")
    }

    return await prisma.user.delete({
        where: {
            id: userId
        }
    })
}

/*  -------------------------- Atualização -------------------------- */

export const updateUser = async (data: userInput, userId: number) => {

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!user) {
        throw new Error("Usuário não existe")
    }

        return await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                email: data.email,
                password: data.password,
                name: data.name
            }
        })
}
