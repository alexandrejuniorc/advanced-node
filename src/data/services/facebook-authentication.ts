import { type FacebookAuthentication } from '@/domain/features'
import { type LoadFacebookUserApi } from '../contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import {
  type SaveFacebookAccountRepository,
  type LoadUserAccountRepository
} from '../contracts/repositories'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository &
    SaveFacebookAccountRepository
  ) {}

  async perform (
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params)

    if (facebookData !== undefined) {
      const account = await this.userAccountRepository.load({
        email: facebookData?.email
      })

      await this.userAccountRepository.saveWithFacebook({
        id: account?.id ?? undefined,
        name: account?.name ?? facebookData.name,
        facebookId: facebookData.facebookId,
        email: facebookData.email
      })
    }

    return new AuthenticationError()
  }
}
