import {Router} from "express";
import { allBooks, bookFilter, bookPerUser, createBook, deleteBook, updateBook } from "../controllers/bookController.js";
import { login, register } from "../controllers/authController.js";
import {Auth} from "../middlewares/authMiddleware.js"
import { deleteUser, getAllUser, updateUser } from "../controllers/userController.js";

export const mainRouter = Router();


//BOOK

mainRouter.post("/book", Auth.private, createBook);

mainRouter.get("/books", Auth.private, allBooks);

mainRouter.get("/users/:id/books", Auth.private, bookPerUser);

mainRouter.delete("/book/:id", Auth.private, deleteBook);

mainRouter.patch("/book/:id", Auth.private, updateBook)

mainRouter.get("/books/filter", Auth.private, bookFilter)


// AUTH

mainRouter.post("/auth/register", register);

mainRouter.post("/auth/login", login);

// USER

mainRouter.get("/users", getAllUser);

mainRouter.delete("/user/:id", Auth.private, deleteUser);

mainRouter.patch("/user/:id", Auth.private, updateUser)