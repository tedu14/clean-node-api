import { IAddAccountModel } from '../../../domain/usesCases/add-acount'
import { IAccountModel } from '../../../domain/models/Account'

export interface IAddAccountRepository {
  add: (account: IAddAccountModel) => Promise<IAccountModel>
}
