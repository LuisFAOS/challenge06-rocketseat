import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

let usersRepository: IUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase

describe("AUTHENTICATING USER", () => {
   beforeEach(() => {
      usersRepository = new InMemoryUsersRepository()
      authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
   })

   it("[AuthenticateUserUseCase] - should be able to authenticate a user", async () => {

      const [email, password] = ["luisfaos.web@gmail.com", "123456789"]
      
      await usersRepository.create({
         email,
         name: "Luis Felipe",
         password: "$2a$08$nMj51eAAGQbwa5Wzt5EVhed4TKoZ6gDYRQISxEJghopKTy1ZJOH72",
       });

      const authInfos = await authenticateUserUseCase.execute({
         email,
         password
      })

      expect(authInfos).toHaveProperty("token")
   })

   it("[AuthenticateUserUseCase] - should not be able to authenticate a user with an invalid email", async () => {
      expect(async () => {
         const [email, password] = ["luisfaos.web@gmail.com", "123456789"]
      
         await usersRepository.create({
            email: "dognoob...@gmail.com",
            name: "Luis Felipe",
            password: "$2a$08$nMj51eAAGQbwa5Wzt5EVhed4TKoZ6gDYRQISxEJghopKTy1ZJOH72",
         });

         await authenticateUserUseCase.execute({
            email,
            password
         })
      }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
   })

   it("[AuthenticateUserUseCase] - should not be able to authenticate a user with an invalid password", async () => {
      expect(async () => {
         const [email, password] = ["luisfaos.web@gmail.com", "123456789-x-"]
      
         await usersRepository.create({
            email,
            name: "Luis Felipe",
            password: "$2a$08$nMj51eAAGQbwa5Wzt5EVhed4TKoZ6gDYRQISxEJghopKTy1ZJOH72",
         });

         await authenticateUserUseCase.execute({
            email,
            password
         })

      }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
   })
})
