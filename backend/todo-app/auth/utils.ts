import { decode } from 'jsonwebtoken'
import { JwtPayload } from './JwtPayload'

export function getUserId(jwtToken: string): string {
  const decodedPayload = decode(jwtToken) as JwtPayload
  return decodedPayload.sub
}

export function getToken(header: string): string {
  if (!header) {
    throw new Error('Missing authenication header')
  }

  if (!header.toLowerCase().startsWith('bearer ')) {
    throw new Error('Missing authenication header')
  }

  return header.split(' ')[1]
}
