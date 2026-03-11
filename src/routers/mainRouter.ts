import Router from "express";
import { createBook } from "../controllers/bookController.js";

export const mainRouter = Router();

mainRouter.get("/ping", (req, res) =>{
    res.json({pong:true})
})


mainRouter.post("/book", createBook);