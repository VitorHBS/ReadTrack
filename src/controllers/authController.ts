import type { Response, Request } from "express";
import * as authService from "../services/authService.js";
import * as userSchema from "../schemas/userSchema.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async(req: Request, res: Response) => {

    const parseBodyRegister = userSchema.userSchema.safeParse(req.body)

    if (!parseBodyRegister.success) {
        throw new AppError("Dados inválidos", 400)
    }

    const result = await authService.register(parseBodyRegister.data);

    return res.status(201).json(result)
});


export const login = asyncHandler(async(req: Request, res: Response) => {

    const parseBodyLogin = userSchema.userSchema.safeParse(req.body)

    if (!parseBodyLogin.success) {
        throw new AppError("Dados inválidos", 400)
    }

    const result = await authService.login(parseBodyLogin.data)

    return res.status(200).json(result);

});

