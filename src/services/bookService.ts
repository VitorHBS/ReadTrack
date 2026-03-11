import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../libs/prisma.js";


/*  -------------------------- Criação -------------------------- */

export const createBook = async (data: Prisma.BookCreateInput) => {
    const bookData = {
        title: data.title,
        author: data.author,
        pages: data.pages,
        status: data.status,
        rating: data.rating ?? null
    }

    const result = await prisma.book.create({
        data: bookData
    })

    return result
}