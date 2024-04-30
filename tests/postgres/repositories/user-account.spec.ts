import { LoadUserAccountRepository } from '../../../src/data/contracts/repositories/user-account'
import { IBackup, newDb } from 'pg-mem'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Repository,
  getConnection,
  getRepository
} from 'typeorm'

class PostgresUserAccountRepository implements LoadUserAccountRepository {
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
  let sut: PostgresUserAccountRepository
  let postgresUserInfo: Repository<PostgresUser>
  let backup: IBackup

  beforeAll(async () => {
    const db = newDb()
    const connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: [PostgresUser]
    })
    await connection.synchronize()
    backup = db.backup()

    postgresUserInfo = getRepository(PostgresUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PostgresUserAccountRepository()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await postgresUserInfo.save({ email: 'any_email' })

      const account = await sut.load({ email: 'any_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'any_email' })

      expect(account).toBeUndefined()
    })
  })
})
