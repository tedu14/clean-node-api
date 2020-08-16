import { SignUpController } from '../signup/SignUpController'
import {
  IEmailValidator,
  IAddAccount,
  IAddAccountModel,
  IAccountModel
} from '../signup/signup-protocols'
import { ServerError, InvalidParamError, MissingParamError } from '../../errors'

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAcount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add(account: IAddAccountModel): Promise<IAccountModel> {
      const fakeAccount = {
        id: 'validId',
        name: 'valid_name',
        email: 'email@exapmle.com',
        password: 'valid_password'
      }

      return await new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

interface ISutTypes {
  sut: SignUpController
  emailValidatorStub: IEmailValidator
  addAccountStub: IAddAccount
}
const makeSut = (): ISutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAcount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('should return a status code 400 if no name is provided', async () => {
    const { sut: signUp } = makeSut()

    const httpRequest = {
      body: {
        email: 'jhondoe@example.com',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = await signUp.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return a status code 400 if no email is provided', async () => {
    const { sut: signUp } = makeSut()

    const httpRequest = {
      body: {
        name: 'jhon doe',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = await signUp.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return a status code 400 if no password is provided', async () => {
    const { sut: signUp } = makeSut()

    const httpRequest = {
      body: {
        name: 'jhon doe',
        email: 'jhondoe@example.com',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = await signUp.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return a status code 400 if no password confirmation is provided', async () => {
    const { sut: signUp } = makeSut()

    const httpRequest = {
      body: {
        name: 'jhon doe',
        email: 'jhondoe@example.com',
        password: '1234'
      }
    }

    const httpResponse = await signUp.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    )
  })

  test('should return a status code 400 if no password confirmation is fails', async () => {
    const { sut: signUp } = makeSut()

    const httpRequest = {
      body: {
        name: 'jhon doe',
        email: 'jhondoe@example.com',
        password: '1234',
        passwordConfirmation: 'invalid'
      }
    }

    const httpResponse = await signUp.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    )
  })

  test('should return a status code 400 if an invalid email is provided', async () => {
    const { sut: signUp, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'jhon doe',
        email: 'invalid_email',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = await signUp.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should call email validator with correct email', async () => {
    const { sut: signUp, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'jhon doe',
        email: 'jhondoe@example.com',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    await signUp.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('jhondoe@example.com')
  })

  test('should return a status code 500 if email validator throws', async () => {
    const { emailValidatorStub, sut: signUp } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'jhon doe',
        email: 'invalid_email',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = await signUp.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should call add account with correct values', async () => {
    const { sut: signUp, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'jhon doe',
        email: 'jhondoe@example.com',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    await signUp.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'jhon doe',
      email: 'jhondoe@example.com',
      password: '1234'
    })
  })

  test('should return a status code 500 if add account throws', async () => {
    const { addAccountStub, sut: signUp } = makeSut()

    jest
      .spyOn(addAccountStub, 'add')
      .mockImplementationOnce(
        async () => await new Promise((resolve, reject) => reject(new Error()))
      )

    const httpRequest = {
      body: {
        name: 'jhon doe',
        email: 'invalid_email',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = await signUp.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return a status code 200 if valid data id provided', async () => {
    const { sut: signUp } = makeSut()

    const httpRequest = {
      body: {
        name: 'jhon doe',
        email: 'invalid_email',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = await signUp.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('id')
  })
})
