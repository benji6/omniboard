import * as dotenv from 'dotenv'

const { error, parsed } = dotenv.config()
if (error) throw error
if (!parsed) throw Error('Missing dotenv config')

export const { AWS_REGION } = parsed
export const { COGNITO_CLIENT_ID } = parsed
export const { COGNITO_USER_POOL_ID } = parsed
export const { DATABASE_HOST } = parsed
export const { DATABASE_USER } = parsed
