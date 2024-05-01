import {
  type SaveFacebookAccountRepository,
  type LoadUserAccountRepository
} from '@/data/contracts/repositories'
import { getRepository } from 'typeorm'
import { PostgresUser } from '../entities'

export class PostgresUserAccountRepository
implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async load (
    params: LoadUserAccountRepository.Params
  ): Promise<LoadUserAccountRepository.Result> {
    const postgresUserRepository = getRepository(PostgresUser)
    const postgresUser = await postgresUserRepository.findOne({
      email: params.email
    })
    if (postgresUser !== undefined) {
      return {
        id: postgresUser?.id.toString(),
        name: postgresUser?.name ?? undefined
      }
    }
  }

  async saveWithFacebook (
    params: SaveFacebookAccountRepository.Params
  ): Promise<SaveFacebookAccountRepository.Result> {
    const postgresUserRepository = getRepository(PostgresUser)

    if (params.id === undefined) {
      const postgresUser = await postgresUserRepository.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      })
      return { id: postgresUser.id.toString() }
    } else {
      await postgresUserRepository.update(
        {
          id: parseInt(params.id)
        },
        {
          name: params.name,
          facebookId: params.facebookId
        }
      )
    }

    return { id: params.id }
  }
}
