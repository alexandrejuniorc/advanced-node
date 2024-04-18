import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import {
  type SaveFacebookAccountRepository,
  type LoadUserAccountRepository
} from '@/data/contracts/repositories'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAccount } from '@/domain/models'
import { mock, type MockProxy } from 'jest-mock-extended'
import { mocked } from 'jest-mock'
import { type TokenGenerator } from '@/data/contracts/crypto'

jest.mock('@/domain/models/facebook-account.model.ts')

describe('Facebook Authentication Service', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let crypto: MockProxy<TokenGenerator>
  let userAccountRepository: MockProxy<
  LoadUserAccountRepository & SaveFacebookAccountRepository
  >

  let sut: FacebookAuthenticationService

  const token = 'any_token'

  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      facebookId: 'any_fb_id',
      email: 'any_fb_email',
      name: 'any_fb_name'
    })

    userAccountRepository = mock()
    crypto = mock()
    userAccountRepository.load.mockResolvedValue(undefined)
    userAccountRepository.saveWithFacebook.mockResolvedValue({
      id: 'any_account_id'
    })

    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      userAccountRepository,
      crypto
    )
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepository.load).toHaveBeenCalledWith({
      email: 'any_fb_email'
    })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const facebookAccountStub = jest
      .fn()
      .mockImplementation(() => ({ any: 'any' }))

    mocked(FacebookAccount).mockImplementation(facebookAccountStub)

    await sut.perform({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      any: 'any'
    })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id'
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })
})
