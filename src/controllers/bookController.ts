import type { Request, Response } from "express";
import * as bookService from "../services/bookService.js";
import * as bkSchema from "../schemas/bookSchema.js"



/*  -------------------------- Criação -------------------------- */

export async function createBook(req: Request, res: Response) {

    const result = bkSchema.bookSchema.safeParse(req.body)
    //mudar para req.user.id quando criar o token do JWT
    const userId = req.body.id

    if (!result.success) {
        return res.status(400).json(result.error)
    }

    const data = result.data;

    const newBook = await bookService.createBook(data, userId);

    return res.status(201).json(newBook);
}

export async function createUser(req: Request, res: Response)  {
    
        const {email, password} = req.body;

    
}


/*  -------------------------- Listagem -------------------------- */


export async function allBooks(req:Request, res: Response) {

    const page = Number (req.query.page) || 1;
    const limit = Number (req.query.limit) || 10;

    const result = await bookService.allBooks(page, limit);
    return res.status(200).json(result);
}

/*  -------------------------- Exclusão -------------------------- */

export async function deleteBook(req:Request, res: Response) {
    
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({message: "Id is required"})
    }

    const result = await bookService.deleteBook(String(id));

    return res.status(200).json(result);

}


/*  -------------------------- Atualização -------------------------- */

export async function updateBook(req:Request, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({message: "Id is required"})
    }

    const parseResult =  bkSchema.bookSchema.safeParse(req.body)

    if(!parseResult.success){
        return res.status(400).json(parseResult.error)
    }

    const  result  = parseResult.data

    const updateBook = await bookService.updateBook(String(id), result);

    if(!updateBook){
        return res.status(404).json({message: "Book not found"})
    }

    return res.status(200).json(updateBook)
}