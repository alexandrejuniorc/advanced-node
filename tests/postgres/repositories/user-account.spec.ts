import { PostgresUser } from '@/infrastructure/postgres/entities/user'
import { PostgresUserAccountRepository } from '@/infrastructure/postgres/repositories'
import { type IBackup } from 'pg-mem'
import { type Repository, getConnection, getRepository } from 'typeorm'
import { makeFakeDatabase } from './mocks'

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

  describe('saveWithFacebook', () => {
    it('should create an account if id is undefined', async () => {
      await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })

      const postgresUser = await postgresUserInfo.findOne({
        email: 'any_email'
      })

      expect(postgresUser?.id).toBe(1)
    })

    it('should update account if id is defined', async () => {
      await postgresUserInfo.save({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })

      await sut.saveWithFacebook({
        id: '1',
        email: 'new_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })

      const postgresUser = await postgresUserInfo.findOne({ id: 1 })

      expect(postgresUser).toEqual({
        id: 1,
        email: 'any_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })
    })
  })
})
