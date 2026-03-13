import { number } from "zod";
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

export const allBooks = async () => {

    return prisma.book.findMany();

}



/*  -------------------------- Exclusão -------------------------- */

export const deleteBook = async (bookId: string) => {
    const Book = await prisma.book.delete({
        where: {
            id: bookId
        }
    })

    return Book
}




/*  -------------------------- Atualização -------------------------- */

export const updateBook = async (bookId: string,  data: bookInput ) => {
    const Book = await prisma.book.update({
        where: {
            id: bookId
        },
        data: {
            title: data.title,
            author: data.author,
            pages: data.pages,
            status: data.status,
            rating: data.rating ?? null
        }
    })

    return Book
}