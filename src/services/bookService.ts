import { use } from "react";
import { prisma } from "../libs/prisma.js";
import type { bookFilterSchema, bookInput, bookUpdateInput } from "../schemas/bookSchema.js";

/*  -------------------------- Criação -------------------------- */

export const createBook = async (data: bookInput, userId: number) => {
    return prisma.book.create({
        data: {
            title: data.title,
            author: data.author,
            pages: data.pages,
            status: data.status,
            rating: data.rating ?? null,
            user: {
                connect: { id: userId }
            }
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
        totalPages: Math.ceil(total / limit)
    }
}


export const bookPerUser = async (userId: number, page: number, limit: number) => {

    const skip = (page - 1) * limit

    const [books, total] = await Promise.all([
        prisma.book.findMany({
            where: { userId: userId },
            skip,
            take: limit,
            orderBy: {
                createdAt: "asc"
            }
        }),
        prisma.book.count({ where: { userId: userId } })
    ])

    return {
        data: books,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        userId
    }

}

/*  -------------------------- Exclusão -------------------------- */

export const deleteBook = async (bookId: string, userId: number) => {

    //achando o livro
    const book = await prisma.book.findUnique({
        where: { id: bookId }
    })

    // livro n existe
    if (!book) {
        throw new Error("Livro não encontrado")
    }

    // outro usuário tentando excluir
    if (book.userId !== userId) {
        throw new Error("Não Autorizado")
    }

    return prisma.book.delete({ where: { id: bookId } })

}




/*  -------------------------- Atualização -------------------------- */

export const updateBook = async (bookId: string, data: bookUpdateInput, userId: number) => {

    //achando livro
    const book = await prisma.book.findUnique({
        where: { id: bookId }
    });

    // livro n existe
    if (!book) {
        throw new Error("Livro não encontrado");
    };

    // outro usuário tentando atualizar
    if (book.userId !== userId) {
        throw new Error("Não Autorizado")
    };

    return prisma.book.update({
        where: { id: bookId },
        data: { ...data, rating: data.rating ?? null }
    });
}


/*  -------------------------- Filtragem -------------------------- */

export const filterBook = async (data: bookFilterSchema, userId: number) => {

    return await prisma.book.findMany({
        where: {
            userId: userId,
            ...(data.title && {
                author: {
                    contains: data.title,
                    mode: "insensitive"
                }
            }),
            ...(data.author && {
                author: {
                    contains: data.author,
                    mode: "insensitive"
                }
            }),
            ...(data.pages && {
                pages: data.pages
            }),
            ...(data.status && {
                status: data.status
            }),
            ...(data.rating && {
                rating: data.rating
            })
        }
    })
}

