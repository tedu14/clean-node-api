import { MissingParamError, InvalidParamError } from '../../errors'
import {
  badRequest,
  serverError,
  successRequest
} from '../../helpers/httpHelper'
import {
  IAddAccount,
  IHttpRequest,
  IHttpResponse,
  iController,
  IEmailValidator
} from './signup-protocols'

export class SignUpController implements iController {
  private readonly emailValidator: IEmailValidator
  private readonly addAccount: IAddAccount

  constructor(emailValidator: IEmailValidator, addAccount: IAddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
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

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = this.addAccount.add({
        name,
        email,
        password
      })

      return successRequest(account)
    } catch (err) {
      return serverError()
    }
  }
}
