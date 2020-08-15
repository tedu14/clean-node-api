import { IHttpRequest, IHttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-params-error'
import { badRequest } from '../helpers/httpHelper'
import { iController } from '../protocols/controller'

export class SignUpController implements iController {
  handle(httpRequest: IHttpRequest): IHttpResponse {
    const requiredField = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredField) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return { statusCode: 200, body: 'Hello World' }
  }
}
