import { type FacebookAuthentication } from '@/domain/features'
import { type LoadFacebookUserApi } from '../contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import {
  type SaveFacebookAccountRepository,
  type LoadUserAccountRepository
} from '../contracts/repositories'
import { FacebookAccount } from '@/domain/models'
import { type TokenGenerator } from '../contracts/crypto'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository &
    SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async perform (
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params)

    if (facebookData !== undefined) {
      const account = await this.userAccountRepository.load({
        email: facebookData?.email
      })
      const facebookAccount = new FacebookAccount(facebookData, account)
      const { id } = await this.userAccountRepository.saveWithFacebook(
        facebookAccount
      )

      await this.crypto.generateToken({ key: id })
    }

    return new AuthenticationError()
  }
}
