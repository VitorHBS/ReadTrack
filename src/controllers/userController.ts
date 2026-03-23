import type { Request, Response } from "express";
import * as userService from "../services/userService.js";
import * as userSchema from "../schemas/userSchema.js"

/**
 * USER CONTROLLER
 *
 * Responsável por requisições relacionadas ao usuário.
 *
 * O que colocar aqui:
 * - Buscar usuário logado
 * - Atualizar dados
 * - Listar usuários (se necessário)
 *
 * O que NÃO colocar:
 * - Lógica de autenticação
 * - Regras complexas
 */


/*  -------------------------- Listagem -------------------------- */

export async function getAllUser(req: Request, res: Response) {

    const users = await userService.getAllUser();

    if (users.length === 0) {
        return res.status(404).json({ message: "Nenhum usuário no banco de dados" });
    }

    return res.status(200).json(users);
}


/*  -------------------------- Exclusão -------------------------- */

export async function deleteUser(req: Request, res: Response) {

    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido !" })
    }

    try {
        await userService.deleteUser(Number(id));
        return res.status(204).send();
    } catch (err) {
        return res.status(404).json({ message: "Usuário não encotrado" })
    }
}


/*  -------------------------- Atualização -------------------------- */