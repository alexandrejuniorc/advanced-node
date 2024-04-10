import { type FacebookAuthentication } from '@/domain/features'

class FacebookAuthenticationService {
  constructor (private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi) {}

  async perform (params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUserByTokenApi.loadUser(params)
  }
}

interface LoadFacebookUserApi {
  loadUser: (token: LoadFacebookUserApi.Params) => Promise<void>
}

namespace LoadFacebookUserApi {
  export interface Params {
    token: string
  }
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string

  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    this.token = params.token
  }
}

describe('Facebook Authentication Service', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserByTokenApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserByTokenApi)

    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserByTokenApi.token).toBe('any_token')
  })
})
