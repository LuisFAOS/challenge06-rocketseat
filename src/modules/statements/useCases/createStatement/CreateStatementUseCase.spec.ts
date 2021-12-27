import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let usersRepository: IUsersRepository
let statementsRepository: IStatementsRepository
let createStatementUseCase: CreateStatementUseCase

describe("CREATING STATEMENT", () => {
   beforeEach(() => {
      usersRepository = new InMemoryUsersRepository()
      statementsRepository = new InMemoryStatementsRepository()
      createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)
   })

   it("[CreateStatementUseCase] - should be able to do a deposit", async () => {
      const {id} = await usersRepository.create({
         email: "luisfaos.web@gmail.com",
         name: "Luis Felipe",
         password: "$2a$08$nMj51eAAGQbwa5Wzt5EVhed4TKoZ6gDYRQISxEJghopKTy1ZJOH72"
      })

      const statement = await createStatementUseCase.execute({
         description: "monthly deposit",
         type: OperationType.DEPOSIT,
         amount: 2000,
         user_id: id || ""
      })

      expect(statement).toHaveProperty("id")
   })

   it("[CreateStatementUseCase] - should be able to do a deposit and withdraw", async () => {
      const {id} = await usersRepository.create({
         email: "luisfaos.web@gmail.com",
         name: "Luis Felipe",
         password: "$2a$08$nMj51eAAGQbwa5Wzt5EVhed4TKoZ6gDYRQISxEJghopKTy1ZJOH72"
      })

      const deposit = await createStatementUseCase.execute({
         description: "monthly deposit",
         type: OperationType.DEPOSIT,
         amount: 4550,
         user_id: id || ""
      })

      const withdraw = await createStatementUseCase.execute({
         description: "withdraw",
         type: OperationType.WITHDRAW,
         amount: 1200,
         user_id: id || ""
      })

      const {balance} = await statementsRepository.getUserBalance({ user_id: id || "" })

      expect(deposit).toHaveProperty("id")
      expect(withdraw).toHaveProperty("id")
      expect(balance).toEqual(deposit.amount - withdraw.amount)
   })

   it("[CreateStatementUseCase] - should not be able to create a statement with a non-existent user", async () => {
      expect(async () => {
         await createStatementUseCase.execute({
            description: "monthly deposit",
            type: OperationType.DEPOSIT,
            amount: 2000,
            user_id: "invalidID"
         })
      }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
   })

   it("[CreateStatementUseCase] - should not be able to withdraw more than your balance", async () => {
      expect(async () => {
         const {id} = await usersRepository.create({
            email: "luisfaos.web@gmail.com",
            name: "Luis Felipe",
            password: "$2a$08$nMj51eAAGQbwa5Wzt5EVhed4TKoZ6gDYRQISxEJghopKTy1ZJOH72"
         })
   
         await createStatementUseCase.execute({
            description: "monthly deposit",
            type: OperationType.DEPOSIT,
            amount: 2000,
            user_id: id || ""
         })
         
         await createStatementUseCase.execute({
            description: "withdrawing to pay my bills",
            type: OperationType.WITHDRAW,
            amount: 3000,
            user_id: id || ""
         })
         
      }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
   })
})
