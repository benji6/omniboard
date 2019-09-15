import 'reflect-metadata'
import { createConnection } from 'typeorm'
import Post from './entities/Post'
import { DATABASE_HOST, DATABASE_USER } from './config'

const connectionPromise = createConnection({
  database: 'omniboard',
  entities: [Post],
  host: DATABASE_HOST,
  logging: ['error'],
  port: 5432,
  synchronize: true,
  type: 'postgres',
  username: DATABASE_USER,
})

export const postRepositoryPromise = connectionPromise
  .then(connection => connection.getRepository(Post))
  .catch(error => {
    console.error(error)
    throw error
  })
