import { type FacebookAuthentication } from '@/domain/features'
import { type LoadFacebookUserApi } from '../contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { type CreateFacebookAccountRepository, type LoadUserAccountRepository } from '../contracts/repositories'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly createFacebookAccountRepository: CreateFacebookAccountRepository
  ) {}

  async perform (
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const facebookData = await this.loadFacebookUserByTokenApi.loadUser(params)

    if (facebookData !== undefined) {
      await this.loadUserAccountRepository.load({ email: facebookData?.email })
      await this.createFacebookAccountRepository.createFromFacebook({
        email: facebookData.email,
        facebookId: facebookData.facebookId,
        name: facebookData.name
      })
    }

    return new AuthenticationError()
  }
}
