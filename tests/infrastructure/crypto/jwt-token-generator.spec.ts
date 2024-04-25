import { type TokenGenerator } from '@/data/contracts/crypto'

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken (params: TokenGenerator.Params): Promise<string> {
    const expirationInSeconds = params.expirationInMs / 1000
    return jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds })
  }
}

describe('JwtTokenGenerator', () => {
  it('should call sign with correct params', async () => {
    const fakeJwt = jwt as jest.Mocked<typeof jwt>
    const sut = new JwtTokenGenerator('any_secret')

    await sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000
    })

    expect(fakeJwt.sign).toHaveBeenCalledWith(
      { key: 'any_key' },
      'any_secret',
      { expiresIn: 1 }
    )
  })
})
