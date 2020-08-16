import { IHttpRequest, IHttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-params-error'
import { badRequest, serverError } from '../helpers/httpHelper'
import { iController } from '../protocols/controller'
import { IEmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-params-error'

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

      const isValid = this.emailValidator.isValid(httpRequest.body.email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      return { statusCode: 200, body: 'Hello World' }
    } catch (err) {
      return serverError()
    }
  }
}
