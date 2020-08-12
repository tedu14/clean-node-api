import { SignUpController } from '../SignUpController'

describe('SignUp Controller', () => {
  test('should return a status code 400 id no name is provided', () => {
    const signUp = new SignUpController()

    const httpRequest = {
      name: 'jhon doe',
      email: 'jhondoe@example.com',
      password: '1234',
      passwordConfirmation: '1234'
    }

    const httpResponse = signUp.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })
})
