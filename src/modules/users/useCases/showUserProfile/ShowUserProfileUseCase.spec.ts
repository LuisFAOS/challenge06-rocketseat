import { User } from "../../entities/User"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let usersRepository: IUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase

describe("SHOWING USER PROFILE", () => {
   beforeEach(() => {
      usersRepository = new InMemoryUsersRepository()
      showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository)
   })

   it("[ShowUserProfileUseCase] - should be able to show user data", async () => {
      const {id} = await usersRepository.create({
         email: "luisfaos.web@gmail.com",
         name: "Luis Felipe",
         password: "$2a$08$nMj51eAAGQbwa5Wzt5EVhed4TKoZ6gDYRQISxEJghopKTy1ZJOH72"
      })

      const user = await showUserProfileUseCase.execute(id || "")

      expect(user).toBeInstanceOf(User)
      expect(user).toHaveProperty("id")
   })

   it("[ShowUserProfileUseCase] - should be able to show user data", async () => {

      expect(async () => {
         await usersRepository.create({
            email: "luisfaos.web@gmail.com",
            name: "Luis Felipe",
            password: "$2a$08$nMj51eAAGQbwa5Wzt5EVhed4TKoZ6gDYRQISxEJghopKTy1ZJOH72"
         })
   
         await showUserProfileUseCase.execute("invalid id")
      }).rejects.toBeInstanceOf(ShowUserProfileError)
   })
})