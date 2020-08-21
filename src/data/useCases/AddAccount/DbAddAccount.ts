import {
  IAddAccount,
  IAddAccountModel
} from '../../../domain/usesCases/add-acount'
import { IAccountModel } from '../../../domain/models/Account'
import { IEncrypter } from '../protocols/IEncrypter'

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
