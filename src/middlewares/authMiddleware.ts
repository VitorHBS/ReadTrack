import type { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();



export const Auth = {
    private: async (req: Request, res: Response, next: NextFunction) => {

        if (!req.headers.authorization) {
            return res.status(401).json({ error: "Token não fornecido" })
        }

        const [authType, token] = req.headers.authorization.split(" ");

        if (authType !== "Bearer" || !token) {
            return res.status(401).json({ error: "Formato de token inválido" })
        }

        try {
            const decoded = JWT.verify(
                token,
                process.env.JWT_SECRET_KEY as string,
            );
            (req as any).user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ error: "Token inválido ou expirado" })
        }
    }
};