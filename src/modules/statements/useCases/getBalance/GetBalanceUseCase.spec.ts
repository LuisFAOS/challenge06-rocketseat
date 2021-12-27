import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let usersRepository: IUsersRepository
let statementsRepository: IStatementsRepository
let getBalanceUseCase: GetBalanceUseCase

describe("GETTING USER BALANCE", () => {
   beforeEach(() => {
      usersRepository = new InMemoryUsersRepository()
      statementsRepository = new InMemoryStatementsRepository()
      getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)
   })

   it("[GetBalanceUseCase] - should be able to get user balance", async () => {
      const {id} = await usersRepository.create({
         email: "fake@email.com",
         name: "fake name",
         password: "$2a$08$nMj51eAAGQbwa5Wzt5EVhed4TKoZ6gDYRQISxEJghopKTy1ZJOH72"
      })

      const {balance: balance1} = await getBalanceUseCase.execute({
         user_id: id || ""
      })

      await statementsRepository.create({
         amount: 410,
         description: "mothly deposit",
         type: OperationType.DEPOSIT,
         user_id: id || ""
      })

      const {balance: balance2} = await getBalanceUseCase.execute({
         user_id: id || ""
      })

      expect(balance1).toEqual(0)
      expect(balance2).toEqual(410)
   })

   it("[GetBalanceUseCase] - should not be able to get user balance with a non-existent user", async () => {
      expect(async () => {
         await getBalanceUseCase.execute({
            user_id: "tazmaniaco ashuablaxuabekiausnuuue invalid ID"
         })
      }).rejects.toBeInstanceOf(GetBalanceError)
   })
})