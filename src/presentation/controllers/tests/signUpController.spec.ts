import { SignUpController } from '../SignUpController'
import { MissingParamError } from '../../errors/missing-params-error'
import { InvalidParamError } from '../../errors/invalid-params-error'
import { IEmailValidator } from '../../protocols/email-validator'

interface ISutTypes {
  sut: SignUpController
  emailValidatorStub: IEmailValidator
}

const makeSut = (): ISutTypes => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('should return a status code 400 if no name is provided', () => {
    const { sut: signUp } = makeSut()

    const httpRequest = {
      body: {
        email: 'jhondoe@example.com',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = signUp.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return a status code 400 if no email is provided', () => {
    const { sut: signUp } = makeSut()

    const httpRequest = {
      body: {
        name: 'jhon doe',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = signUp.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return a status code 400 if no password is provided', () => {
    const { sut: signUp } = makeSut()

    const httpRequest = {
      body: {
        name: 'jhon doe',
        email: 'jhondoe@example.com',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = signUp.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return a status code 400 if no password confirmation is provided', () => {
    const { sut: signUp } = makeSut()

    const httpRequest = {
      body: {
        name: 'jhon doe',
        email: 'jhondoe@example.com',
        password: '1234'
      }
    }

    const httpResponse = signUp.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    )
  })

  test('should return a status code 400 if an invalid email is provided', () => {
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

    const httpResponse = signUp.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
})
