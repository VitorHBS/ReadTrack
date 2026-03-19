import { prisma } from "../libs/prisma.js";
import type  {userInput} from "../schemas/userSchema.js";
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



/*  -------------------------- Exclusão -------------------------- */


/*  -------------------------- Atualização -------------------------- */