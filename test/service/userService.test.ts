import { jest } from "@jest/globals"

// 1. Criamos a referência da função mockada ANTES de mockar o módulo
const mockPrismaCreate = jest.fn()

// 2. Usamos unstable_mockModule (obrigatório para ESM no Jest)
jest.unstable_mockModule("../../src/libs/prisma.js", () => ({
    prisma: {
        user: {
            create: mockPrismaCreate
        }
    }
}))

jest.unstable_mockModule("bcrypt", () => ({

    // Nota: Se no seu userService você faz `import bcrypt from "bcrypt"`, 
    // descomente a linha abaixo para mockar o export default também:
    // default: { hash: jest.fn().mockResolvedValue("hashedsenha") }
}))

// 3. Importamos o service DINAMICAMENTE apenas APÓS os mocks serem registrados
const { createUser } = await import("../../src/services/userService.js")

describe("createUser", () => {
    test("deve criar um usuário com sucesso", async () => {
        // Arrange
        const input = { email: "vitor@gmail.com", password: "123456", name: "Vitor" }
        const fakeUser = { id: 1, email: "vitor@gmail.com", password: "hashedsenha", name: "Vitor", avatar: null }

        // Usamos a referência mockPrismaCreate diretamente


        // Act
        const result = await createUser(input)

        // Assert
        expect(mockPrismaCreate).toHaveBeenCalledWith({
            data: {
                email: input.email,
                password: "hashedsenha",
                name: input.name
            }
        })
        expect(result).toEqual(fakeUser)
    })
})