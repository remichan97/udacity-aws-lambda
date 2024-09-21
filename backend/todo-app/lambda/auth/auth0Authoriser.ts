import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'
import axios from 'axios'

const log = createLogger('auth')

const jwkUrls = ``

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  log.info('Authorising user', event.authorizationToken)
  try {
    const token = await verifyJwt(event.authorizationToken as string)
    log.info('Authentication completed', token)
    return {
      principalId: token.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (error) {
    log.error('Authentication failed', { error: error.message })
  }
  return {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Deny',
          Resource: '*'
        }
      ]
    }
  }
}

async function verifyJwt(authHeader: string): Promise<JwtPayload> {
  try {
    const token = getToken(authHeader)
    const res = await axios.get(jwkUrls)

    const pemData = res['data']['keys'][0]['x5c'][0]
    const cert = `-----BEGIN CERTIFICATE-----\n${pemData}\n-----END CERTIFICATE-----`

    return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
  } catch (error) {
    log.error('Verification failure', error)
  }
  return undefined as unknown as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
