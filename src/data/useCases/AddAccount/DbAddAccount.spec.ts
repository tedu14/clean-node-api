import { DbAddAccount } from './DbAddAccount'

describe('DbAddAccount UseCase', () => {
  test('should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt(value: string): Promise<string> {
        return await new Promise(resolve => resolve('hashed_password'))
      }
    }

    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)

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
