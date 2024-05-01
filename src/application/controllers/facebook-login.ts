import { type FacebookAuthentication } from '@/domain/features'
import { type HttpHelper } from '@/application/helpers'
import { AccessToken } from '@/domain/models'
import { ServerError } from '@/application/errors'

interface HttpRequest { token: any }

export class FacebookLoginController {
  constructor (private readonly facebookAuth: FacebookAuthentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpHelper.Response> {
    try {
      if (
        httpRequest.token === '' ||
        httpRequest.token === null ||
        httpRequest.token === undefined
      ) {
        return {
          statusCode: 400,
          data: new Error('The field token is required')
        }
      }

      const result = await this.facebookAuth.perform({ token: httpRequest.token })

      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            accessToken: result.value
          }
        }
      } else {
        return {
          statusCode: 401,
          data: result
        }
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error as Error)
      }
    }
  }
}
