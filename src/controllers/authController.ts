/**
 * AUTH CONTROLLER
 *
 * Responsável por lidar com requisições HTTP relacionadas à autenticação.
 *
 * O que colocar aqui:
 * - Receber req (request)
 * - Validar dados (opcional, com Zod)
 * - Chamar o authService
 * - Retornar res (response)
 *
 * O que NÃO colocar:
 * - Lógica de negócio
 * - Acesso direto ao banco
 * - Regras de autenticação (JWT, etc)
 */

import type { Response, Request } from "express";
import * as authService from "../services/authService.js";

export const register = async (req: Request, res: Response) => {
    try {
        const result = await authService.register(req.body);
        return res.status(201).json(result)
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                error: err.message || "Erro ao registrar Usuário"
            });
        }

        return res.status(400).json({
            error: "Erro desconhecido"
        });

    }
}