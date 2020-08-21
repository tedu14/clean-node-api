import { DbAddAccount } from './DbAddAccount'
import { IEncrypter } from '../protocols/IEncrypter'

interface IMakeSut {
  encrypterStub: IEncrypter
  sut: DbAddAccount
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
  const sut = new DbAddAccount(encrypterStub)

  return {
    encrypterStub,
    sut
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
})
