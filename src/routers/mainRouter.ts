import {Router} from "express";
import { allBooks, createBook, deleteBook, updateBook } from "../controllers/bookController.js";
import { register } from "../controllers/authController.js";

export const mainRouter = Router();


//BOOK

mainRouter.post("/book", createBook);

mainRouter.get("/books", allBooks);

mainRouter.delete("/book/:id", deleteBook);

mainRouter.patch("/book/:id", updateBook)


// AUTH

mainRouter.post("/auth/register", register);