import {
  type SaveFacebookAccountRepository,
  type LoadUserAccountRepository
} from '@/data/contracts/repositories'
import { getRepository } from 'typeorm'
import { PostgresUser } from '../entities'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result

type SaveParams = SaveFacebookAccountRepository.Params
type SaveResult = SaveFacebookAccountRepository.Result

export class PostgresUserAccountRepository
implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly postgresUserRepository = getRepository(PostgresUser)

  async load (params: LoadParams): Promise<LoadResult> {
    const postgresUser = await this.postgresUserRepository.findOne({
      email: params.email
    })
    if (postgresUser !== undefined) {
      return {
        id: postgresUser?.id.toString(),
        name: postgresUser?.name ?? undefined
      }
    }
  }

  async saveWithFacebook (params: SaveParams): Promise<SaveResult> {
    if (params.id === undefined) {
      const postgresUser = await this.postgresUserRepository.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      })
      return { id: postgresUser.id.toString() }
    } else {
      await this.postgresUserRepository.update(
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
