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

export const allBooks = async (page: number, limit: number) => {

    const skip = (page - 1) * limit

    const [books, total] = await Promise.all([
        prisma.book.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: "asc"
            }
        }),
        prisma.book.count()
    ])

    return {
        data: books,
        total,
        page,
        totalPages: Math.ceil(total/ limit)
    }
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

export const updateBook = async (bookId: string, data: bookInput) => {
    const Book = await prisma.book.update({
        where: { id: bookId },
        data: {
            ...data,
            rating: data.rating ?? null
        }

    })

    return Book
}