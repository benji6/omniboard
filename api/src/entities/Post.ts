import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export default class Post {
  @Column('text')
  body!: string

  @PrimaryGeneratedColumn()
  id!: number

  @Column('text')
  location!: string

  @Column('json')
  tags!: string[]

  @Column('text')
  title!: string

  @Column('text')
  userId!: string
}
