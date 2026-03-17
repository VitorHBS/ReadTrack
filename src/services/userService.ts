import { prisma } from "../libs/prisma.js";
import type  {userInput} from "../schemas/userSchema.js"

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
    return prisma.user.create({
        data: {
            email: data.email,
            password: data.password,
            name: data.name ?? null
        }
    })
}


/*  -------------------------- Listagem -------------------------- */



/*  -------------------------- Exclusão -------------------------- */


/*  -------------------------- Atualização -------------------------- */