import { IHttpRequest, IHttpResponse } from './http'

export interface iController {
  handle: (httpRequest: IHttpRequest) => Promise<IHttpResponse>
}
