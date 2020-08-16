import {
  IHttpRequest,
  IHttpResponse,
  IEmailValidator,
  iController
} from '../protocols'
import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/httpHelper'

export class SignUpController implements iController {
  private readonly emailValidator: IEmailValidator

  constructor(emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }

  handle(httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredField = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]
      for (const field of requiredField) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      return { statusCode: 200, body: 'Hello World' }
    } catch (err) {
      return serverError()
    }
  }
}
