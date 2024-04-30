import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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
