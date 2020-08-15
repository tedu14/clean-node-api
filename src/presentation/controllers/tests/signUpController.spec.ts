import { SignUpController } from '../SignUpController'
import { MissingParamError } from '../../errors/missing-params-error'

const makeSut = () => {
  return new SignUpController()
}

describe('SignUp Controller', () => {
  test('should return a status code 400 if no name is provided', () => {
    const signUp = makeSut()

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
    const signUp = makeSut()

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
    const signUp = makeSut()

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
    const signUp = makeSut()

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
})
