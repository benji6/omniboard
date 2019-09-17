import { Pool } from 'pg'
import { DATABASE_HOST, DATABASE_USER } from '../config'

export default new Pool({
  database: 'omniboard',
  host: DATABASE_HOST,
  port: 5432,
  user: DATABASE_USER,
})
