import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let usersRepository: IUsersRepository
let statementsRepository: IStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

describe("GETTING STATEMENT OPERATION", () => {
   beforeEach(() => {
      usersRepository = new InMemoryUsersRepository()
      statementsRepository = new InMemoryStatementsRepository()
      getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository)
   })

   it("[GetStatementOperationUseCase] - should be able to get statement operation", async () => {
      const {id} = await usersRepository.create({
         email: "fake@email.com",
         name: "fake name",
         password: "$2a$08$nMj51eAAGQbwa5Wzt5EVhed4TKoZ6gDYRQISxEJghopKTy1ZJOH72"
      })

      const statement = await statementsRepository.create({
         amount: 410,
         description: "mothly deposit",
         type: OperationType.DEPOSIT,
         user_id: id || ""
      })

      const statementOperation = await getStatementOperationUseCase.execute({ 
         user_id: id || "", 
         statement_id: statement.id || ""
      })

      expect(statementOperation).toHaveProperty("id")
      expect(statementOperation.type).toEqual("deposit")
   })
})