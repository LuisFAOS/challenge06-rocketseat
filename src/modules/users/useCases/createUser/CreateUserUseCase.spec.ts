import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let usersRepository: IUsersRepository
let createUserUseCase: CreateUserUseCase

describe("CREATING USER", () => {
   beforeEach(() => {
      usersRepository = new InMemoryUsersRepository()
      createUserUseCase = new CreateUserUseCase(usersRepository)
   })

   it("[CreateUserUseCase] - should be able to create a user", async () => {
      const user = await createUserUseCase.execute({
         name: "Luis Felipe",
         email: "luisfaos.web@gmail.com",
         password: "123456789"
      })

      expect(user).toHaveProperty("id")
   })

   it("[CreateUserUseCase] - should not be able to create a user with an existing email ", async () => {
      expect(async () => {
         const user = {
            name: "Luis Felipe",
            email: "luisfaos.web@gmail.com",
            password: "123456789"
         }

         await createUserUseCase.execute(user)
         
         await createUserUseCase.execute({
            name: "Luis",
            email: user.email,
            password: "kkkk998533"
         })
      }).rejects.toBeInstanceOf(CreateUserError)
   })
})