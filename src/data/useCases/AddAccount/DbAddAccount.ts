import {
  IAddAccount,
  IAccountModel,
  IAddAccountModel,
  IEncrypter
} from './db-add-account-protocols'
import { IAddAccountRepository } from '../protocols/IAddAccountRepository'

export class DbAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter
  private readonly accountRepository: IAddAccountRepository

  constructor(encrypter: IEncrypter, accountRepository: IAddAccountRepository) {
    this.encrypter = encrypter
    this.accountRepository = accountRepository
  }

  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const hash = await this.encrypter.encrypt(accountData.password)
    await this.accountRepository.add(
      Object.assign({}, accountData, { password: hash })
    )
    return await new Promise(resolve => resolve(undefined))
  }
}
