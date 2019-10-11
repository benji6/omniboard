import * as jwt from 'jsonwebtoken'
import * as jwkToPem from 'jwk-to-pem'
import fetch from 'node-fetch'
import { AWS_REGION, COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } from '../config'

const ISSUER = `https://cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`

interface IJwt {
  header: { [key: string]: string }
  payload: {
    aud: string
    auth_time: number
    'cognito:username': string
    email_verified: boolean
    email: string
    event_id: string
    exp: number
    iat: number
    iss: string
    sub: string
    token_use: string
  }
  signature: { [key: string]: string }
}

interface IJwk {
  alg: string
  e: string
  kid: string
  kty: string
  n: string
  use: string
}

let cachedJwks: IJwk[]
const getJwks = async (): Promise<IJwk[]> => {
  const response = await fetch(`${ISSUER}/.well-known/jwks.json`)
  if (!response.ok) throw Error(`Bad status code: ${response.status}`)
  const { keys } = await response.json()
  return (cachedJwks = keys)
}

export const validateToken = async (
  token: string,
): Promise<IJwt['payload']> => {
  const decodedJwt = jwt.decode(token, { complete: true }) as IJwt | null
  if (!decodedJwt) throw Error('Not a valid JWT')
  const {
    header,
    payload: { token_use },
  } = decodedJwt
  if (token_use !== 'id') throw Error(`Invalid token_use: ${token_use}`)

  const jwks = cachedJwks || (await getJwks())
  const jwk = jwks.find(jwk => jwk.kid === header.kid)
  if (!jwk)
    throw Error(`Token key ID does not match any JSON Web Key: ${header.kid}`)
  const pem = jwkToPem({ kty: jwk.kty, n: jwk.n, e: jwk.e })

  return new Promise((resolve, reject) =>
    jwt.verify(
      token,
      pem,
      { audience: COGNITO_CLIENT_ID, issuer: ISSUER },
      (err, payload) => {
        if (err) {
          console.error(err.name)
          return reject(err)
        }
        resolve(payload as IJwt['payload'])
      },
    ),
  )
}
