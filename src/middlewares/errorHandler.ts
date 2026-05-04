import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    //// erro conhecido (nosso)
    if(err instanceof AppError) {
        return res.status(err.status).json({
            message: err.message
        })
    }

    // erro desconhecido (bug, lib, etc)
    console.error(err);

    return res.status(500).json({
        message: "Internal server error"
    })
}