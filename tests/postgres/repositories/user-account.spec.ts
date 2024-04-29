import { LoadUserAccountRepository } from '../../../src/data/contracts/repositories/user-account'
import { newDb } from 'pg-mem'
import { Column, Entity, PrimaryGeneratedColumn, getRepository } from 'typeorm'

class PostgresUserAccountRepository implements LoadUserAccountRepository {
  async load (
    params: LoadUserAccountRepository.Params
  ): Promise<LoadUserAccountRepository.Result> {
    const postgresUserRepository = getRepository(PostgresUser)
    const postgresUser = await postgresUserRepository.findOne({ email: params.email })
    if (postgresUser !== undefined) {
      return {
        id: postgresUser?.id.toString(),
        name: postgresUser?.name ?? undefined
      }
    }
  }
}

@Entity({ name: 'users' })
export class PostgresUser {
  @PrimaryGeneratedColumn('increment')
    id!: number

  @Column({ name: 'name', nullable: true })
    name?: string

  @Column()
    email!: string

  @Column({ name: 'id_facebook', nullable: true })
    facebookId!: string
}

describe('PostgresUserAccountRepository', () => {
  beforeAll(() => {})
  beforeEach(() => {})

  describe('load', () => {
    it('should return an account if email exists', async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PostgresUser]
      })
      await connection.synchronize()
      const postgresUserRepository = getRepository(PostgresUser)
      await postgresUserRepository.save({ email: 'existing_email' })

      const sut = new PostgresUserAccountRepository()
      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })
    })
  })
})
