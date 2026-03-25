import type { Request, Response } from "express";
import * as bookService from "../services/bookService.js";
import * as bkSchema from "../schemas/bookSchema.js"



/*  -------------------------- Criação -------------------------- */

export async function createBook(req: Request, res: Response) {

    const result = bkSchema.bookSchema.safeParse(req.body)

    const userId = req.user?.id

    if (!result.success) {
        return res.status(400).json(result.error)
    }

    const data = result.data;

    try {
        const newBook = await bookService.createBook(data, Number(userId));
        return res.status(201).json(newBook);

    } catch (err) {
        if (err instanceof Error) {
            if (err instanceof Error) {
                return res.status(403).json({ error: err.message })
            }
            return res.status(500).json({ error: "Erro desconhecido" });
        }
    }
}



/*  -------------------------- Listagem -------------------------- */


export async function allBooks(req: Request, res: Response) {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await bookService.allBooks(page, limit);
    return res.status(200).json(result);
}

export async function bookPerUser(req: Request, res: Response) {

    const { id } = req.params

    const result = await bookService.bookPerUser(Number(id))

    return res.status(200).json(result);
}

/*  -------------------------- Exclusão -------------------------- */

export async function deleteBook(req: Request, res: Response) {

    const { id } = req.params;
    const userId = req.user?.id

    if (!id) {
        return res.status(400).json({ message: "Id is required" })
    }

    try {
        const result = await bookService.deleteBook(String(id), Number(userId));
        return res.status(200).json(result);

    } catch (err) {
        if (err instanceof Error) {
            return res.status(403).json({ error: err.message })
        }
        return res.status(500).json({ error: "Erro desconhecido" });
    }
}



/*  -------------------------- Atualização -------------------------- */

export async function updateBook(req: Request, res: Response) {
    const { id } = req.params;
    const userID = req.user?.id;

    if (!id) {
        return res.status(400).json({ message: "Id is required" })
    }

    const parseResult = bkSchema.bookUpdateSchema.safeParse(req.body)

    if (!parseResult.success) {
        return res.status(400).json(parseResult.error)
    }

    try {
        const updateBook = await bookService.updateBook(String(id), parseResult.data, Number(userID));
        return res.status(200).json(updateBook)

    } catch (err) {
        if (err instanceof Error) {
            return res.status(403).json({ error: err.message })
        }
        return res.status(500).json({ error: "Erro desconhecido" });
    }


}