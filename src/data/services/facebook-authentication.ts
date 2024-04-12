import { type FacebookAuthentication } from '@/domain/features'
import { type LoadFacebookUserApi } from '../contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import {
  type UpdateFacebookAccountRepository,
  type CreateFacebookAccountRepository,
  type LoadUserAccountRepository
} from '../contracts/repositories'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository &
    CreateFacebookAccountRepository &
    UpdateFacebookAccountRepository
  ) {}

  async perform (
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params)

    if (facebookData !== undefined) {
      const account = await this.userAccountRepository.load({
        email: facebookData?.email
      })

      if (account !== undefined) {
        await this.userAccountRepository.updateWithFacebook({
          id: account.id,
          name: account.name ?? facebookData.name,
          facebookId: facebookData.facebookId
        })
      } else {
        await this.userAccountRepository.createFromFacebook({
          email: facebookData.email,
          facebookId: facebookData.facebookId,
          name: facebookData.name
        })
      }
    }

    return new AuthenticationError()
  }
}
