import type { Request, Response } from "express";
import * as bookService from "../services/bookService.js";
import * as bkSchema from "../schemas/bookSchema.js";
import * as userService from "../services/userService.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/*  -------------------------- Criação -------------------------- */

export const createBook = asyncHandler(async(req: Request, res: Response) => {

    const result = bkSchema.bookSchema.safeParse(req.body)

    const userId = req.user?.id

    if (!userId) {
        throw new AppError("ID is required", 400)
    }

    if (!result.success) {
        throw new AppError("Dados inválidos", 400)
    }

    const data = result.data;

    const newBook = await bookService.createBook(data, Number(userId));
    return res.status(201).json(newBook);
})



/*  -------------------------- Listagem -------------------------- */


export const allBooks = asyncHandler(async(req: Request, res: Response) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await bookService.allBooks(page, limit);
    return res.status(200).json(result);
});


export const bookPerUser = asyncHandler(async (req: Request, res: Response) => {

    const { id } = req.params;
    const tokenUserId = req.user?.id;
    const userId = Number(id)

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;


    if (!id || isNaN(userId)) {
        throw new AppError("ID inválido", 400)
    }

    const user = await userService.findById(userId);

    if (!user) {
        throw new AppError("Usuário não existe", 404)
    }

    if (tokenUserId !== userId) {
        throw new AppError("Não tem permissão para realizar essa ação", 403)
    }

    const result = await bookService.bookPerUser(userId, page, limit)

    return res.status(200).json(result);
})

/*  -------------------------- Exclusão -------------------------- */

export const deleteBook = asyncHandler(async(req: Request, res: Response) => {

    const { id } = req.params;
    const userId = req.user?.id

    if (!id) {
        throw new AppError("ID is required", 400)
    }

    const result = await bookService.deleteBook(String(id), Number(userId));
    return res.status(200).json(result);
});



/*  -------------------------- Atualização -------------------------- */

export const updateBook = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;
    const userID = req.user?.id;

    if (!id) {
        throw new AppError("ID is required", 400)
    }

    const parseResult = bkSchema.bookUpdateSchema.safeParse(req.body)

    if (!parseResult.success) {
        throw new AppError("Dados inválidos", 400)
    }

    const updateBook = await bookService.updateBook(String(id), parseResult.data, Number(userID));
    return res.status(200).json(updateBook)
});

