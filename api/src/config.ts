import * as dotenv from 'dotenv'

const { error, parsed } = dotenv.config()
if (error) throw error
if (!parsed) throw Error('Missing dotenv config')

export const { DATABASE_HOST } = parsed
export const { DATABASE_USER } = parsed
