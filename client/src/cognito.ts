import {
  CognitoIdToken,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js'

export const userPool = new CognitoUserPool({
  ClientId: '5lb4a39ufrkmtkk3lq88046qp1',
  UserPoolId: 'us-east-1_2qz2CACPR',
})

export const getIdToken = (): Promise<CognitoIdToken> =>
  new Promise((resolve, reject) => {
    const currentUser = userPool.getCurrentUser()
    if (!currentUser) return reject(Error('No current user'))
    currentUser.getSession(
      async (err: Error | void, session: CognitoUserSession) => {
        if (!err) return resolve(session.getIdToken())
        if (err.message === 'User does not exist.') {
          currentUser.signOut()
          return reject(Error('No current user'))
        }
        reject(err)
      },
    )
  })
