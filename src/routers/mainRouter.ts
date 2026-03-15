import Router from "express";
import { allBooks, createBook, deleteBook, updateBook } from "../controllers/bookController.js";

export const mainRouter = Router();


mainRouter.post("/book", createBook);



mainRouter.get("/books", allBooks);



mainRouter.delete("/book/:id", deleteBook);



mainRouter.patch("/book/:id", updateBook)