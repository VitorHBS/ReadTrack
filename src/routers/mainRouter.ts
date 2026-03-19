import {Router} from "express";
import { allBooks, createBook, deleteBook, updateBook } from "../controllers/bookController.js";
import { login, register } from "../controllers/authController.js";
import {Auth} from "../middlewares/authMiddleware.js"

export const mainRouter = Router();


//BOOK

mainRouter.post("/book", Auth.private, createBook);

mainRouter.get("/books", allBooks);

mainRouter.delete("/book/:id", Auth.private, deleteBook);

mainRouter.patch("/book/:id", Auth.private, updateBook)


// AUTH

mainRouter.post("/auth/register", register);

mainRouter.post("/auth/login", login);