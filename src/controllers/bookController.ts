import type { Request, Response } from "express";
import * as bookService from "../services/bookService.js";
import * as bkSchema from "../schemas/bookSchema.js"



/*  -------------------------- Criação -------------------------- */

export async function createBook(req: Request, res: Response) {

    const result = bkSchema.bookSchema.safeParse(req.body)

    if (!result.success) {
        return res.status(400).json(result.error)
    }

    const data = result.data;

    const newBook = await bookService.createBook(data);

    return res.status(201).json(newBook);
}


/*  -------------------------- Listagem -------------------------- */


export async function allBooks(req:Request, res: Response) {

    const result = await bookService.allBooks()

    return res.status(200).json(result);
}

/*  -------------------------- Exclusão -------------------------- */

export async function deleteBook(req:Request, res: Response) {
    
    const { id } = req.params;



    const result = await bookService.deleteBook(String(id));

    return res.status(200).json(result);

}


/*  -------------------------- Atualização -------------------------- */

export async function updateBook(req:Request, res: Response) {
    const { id } = req.params;

    const { data } = req.body

    const result = await bookService.updateBook(String(id), data)
}