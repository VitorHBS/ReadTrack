export class AppError extends Error {
    status: number
    isOperational: boolean //isOperational ajuda a diferenciar erro esperado vs bug


    constructor(message: string, status = 500) {
        super(message)
        this.status = status
        this.isOperational = true

        //Pra garantir que o instanceof funcione corretamente
        //(principalmente no Node) Isso evita bugs estranhos com herança de Error
        Object.setPrototypeOf(this, AppError.prototype)
    }
}