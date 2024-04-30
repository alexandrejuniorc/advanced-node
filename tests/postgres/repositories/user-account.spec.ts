import { PostgresUser } from '@/infrastructure/postgres/entities/user'
import { PostgresUserAccountRepository } from '@/infrastructure/postgres/repositories'
import { type IBackup, newDb, type IMemoryDb } from 'pg-mem'
import { type Repository, getConnection, getRepository } from 'typeorm'

const makeFakeDatabase = async (entities?: any): Promise<IMemoryDb> => {
  const db = newDb()
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infrastructure/postgres/entities/index.ts']
  })
  await connection.synchronize()
  return db
}

describe('PostgresUserAccountRepository', () => {
  let sut: PostgresUserAccountRepository
  let postgresUserInfo: Repository<PostgresUser>
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDatabase([PostgresUser])
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
