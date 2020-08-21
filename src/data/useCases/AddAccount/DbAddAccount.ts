import {
  IAddAccount,
  IAccountModel,
  IAddAccountModel,
  IEncrypter
} from './db-add-account-protocols'

export class DbAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter

  constructor(encrypter: IEncrypter) {
    this.encrypter = encrypter
  }

  async add(account: IAddAccountModel): Promise<IAccountModel> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => resolve(undefined))
  }
}
