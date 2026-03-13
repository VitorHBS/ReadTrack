import { prisma } from "../libs/prisma.js";
import type { bookInput } from "../schemas/bookSchema.js";


/*  -------------------------- Criação -------------------------- */

export const createBook = async (data: bookInput) => {
    return prisma.book.create({
        data: {
            title: data.title,
            author: data.author,
            pages: data.pages,
            status: data.status,
            rating: data.rating ?? null
        }
    })
}


/*  -------------------------- Listagem -------------------------- */

export const allBooks = async() => {

    return prisma.book.findMany();
    
}