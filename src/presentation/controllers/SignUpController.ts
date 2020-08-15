import { IHttpRequest, IHttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-params-error'
import { badRequest } from '../helpers/httpHelper'

export class SignUpController {
  handle(httpRequest: IHttpRequest): IHttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }

    return { statusCode: 200, body: 'Hello World' }
  }
}
