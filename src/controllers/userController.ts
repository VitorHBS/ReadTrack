import type { Request, Response } from "express";
import * as userService from "../services/userService.js";
import * as userSchema from "../schemas/userSchema.js"
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/*  -------------------------- Listagem -------------------------- */

export const getAllUser = asyncHandler(async(req: Request, res: Response) => {

    const users = await userService.getAllUser();

    if (users.length === 0) {
        return res.status(404).json({ message: "Nenhum usuário no banco de dados" });
    }

    return res.status(200).json(users);
})


/*  -------------------------- Exclusão -------------------------- */

export const deleteUser = asyncHandler(async(req: Request, res: Response) => {

    const { id } = req.params;
    const userId = Number(id)
    const tokenUserId = req.user?.id;

    if (!id || isNaN(userId)) {
        throw new AppError("ID inválido", 400)
    }

    const user = await userService.findById(userId)

    if (!user) {
        throw new AppError("Usuário não encontrado", 404)
    }

    if (tokenUserId !== userId) {
        throw new AppError("Sem autorização", 403)
    }

    await userService.deleteUser(userId);
    return res.status(204).send();
})


/*  -------------------------- Atualização -------------------------- */

export const updateUser = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;
    const userId = Number(id)
    const tokenUserId = req.user?.id

    if (!id || isNaN(userId)) {
        throw new AppError("ID inválido", 400)
    }

    const safeBody = userSchema.userSchema.safeParse(req.body);

    if (!safeBody.success) {
        throw new AppError("Dados inválidos", 400)
    }

    const bodyData = safeBody.data;

    const user = await userService.findById(userId);

    if (!user) {
        throw new AppError("Usuário não encontrado", 404)
    }

    if (tokenUserId !== userId) {
        throw new AppError("Sem autorização", 403)
    }

    const updated = await userService.updateUser(bodyData, userId);
    return res.status(200).json(updated);
})