import { DbAddAccount } from './DbAddAccount'
import { IEncrypter } from './db-add-account-protocols'
import { IAddAccountModel } from '../../../domain/usesCases/add-acount'
import { IAddAccountRepository } from '../protocols/IAddAccountRepository'
import { IAccountModel } from '../../../domain/models/Account'

interface IMakeSut {
  encrypterStub: IEncrypter
  sut: DbAddAccount
  AddAccountRepositoryStub: any
}

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepository implements IAddAccountRepository {
    async add(account: IAddAccountModel): Promise<IAccountModel> {
      return await new Promise(resolve =>
        resolve(
          Object.assign({}, account, {
            id: 'uuid',
            password: 'hashed_password'
          })
        )
      )
    }
  }

  return new AddAccountRepository()
}

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
}

const makeSut = (): IMakeSut => {
  const encrypterStub = makeEncrypter()
  const AddAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, AddAccountRepositoryStub)

  return {
    encrypterStub,
    sut,
    AddAccountRepositoryStub
  }
}

describe('DbAddAccount UseCase', () => {
  test('should call Encrypter with correct password', async () => {
    const { encrypterStub, sut } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name: 'name',
      email: 'email@example.com',
      password: 'password'
    }

    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('password')
  })

  test('should throw if Encrypter throws', async () => {
    const { encrypterStub, sut } = makeSut()

    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const accountData = {
      name: 'name',
      email: 'email@example.com',
      password: 'password'
    }

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { AddAccountRepositoryStub, sut } = makeSut()

    const AddSpy = jest.spyOn(AddAccountRepositoryStub, 'add')

    const accountData = {
      name: 'name',
      email: 'email@example.com',
      password: 'password'
    }

    await sut.add(accountData)

    expect(AddSpy).toHaveBeenCalledWith({
      name: 'name',
      email: 'email@example.com',
      password: 'hashed_password'
    })
  })
})
