export namespace FacebookLoginController {
  export interface Request {
    token: string
  }

  export interface Response {
    statusCode: number
    data: any
  }
}

class FacebookLoginController {
  async handle (httpRequest: FacebookLoginController.Request): Promise<FacebookLoginController.Response> {
    return {
      statusCode: 400,
      data: new Error('The field token is required')

    }
  }
}

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController

  beforeAll(() => {})

  beforeEach(() => {
    sut = new FacebookLoginController()
  })

  it('should return 400 if token is empty', async () => {
    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })
})
