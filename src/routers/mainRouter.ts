import Router from "express";
import { allBooks, createBook } from "../controllers/bookController.js";

export const mainRouter = Router();

mainRouter.get("/ping", (req, res) =>{
    res.json({pong:true})
})


mainRouter.post("/book", createBook);


mainRouter.get("/books", allBooks);