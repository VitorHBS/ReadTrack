import { prisma } from "../libs/prisma.js";
import {type bookFilterSchema, type bookInput, type bookUpdateInput } from "../schemas/bookSchema.js";
import { Prisma, BookStatus } from "../generated/prisma/client.js"

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

export const filterBook = async (search: string, userId: number) => {

    const searchNumber = Number(search)
    const isNumber = !isNaN(searchNumber) && search.trim() !== "";

    const statusValue = search.toUpperCase();
    const isStatus = Object.values(BookStatus).includes(statusValue as BookStatus);

    const ratingNumber = parseFloat(search);
    const isFloat = !isNaN(ratingNumber) && search.trim() !== "";


    const orConditions: Prisma.BookWhereInput[] = [
        {
            title: {
                contains: search,
                mode: "insensitive"
            }
        },
        {
            author: {
                contains: search,
                mode: "insensitive"
            }
        },
    ];

    if (isNumber) {
        orConditions.push({
            pages: { equals: searchNumber }
        });
    }

    if (isStatus) {
        orConditions.push({
            status: { equals: statusValue as BookStatus }
        })
    }

    if (isFloat) {
        orConditions.push({
            rating: {
                gte: ratingNumber - 0.5,
                lte: ratingNumber + 0.5
            }
        })
    }

    return await prisma.book.findMany({
        where: { userId, OR: orConditions }
    })
}

