import type { Request, Response } from "express";
import * as bookService from "../services/bookService.js";


/*  -------------------------- Criação -------------------------- */

export async function createBook(req:Request, res:Response) {
    const book = await bookService.createBook(req.body);
    return res.status(201).json(book);
}