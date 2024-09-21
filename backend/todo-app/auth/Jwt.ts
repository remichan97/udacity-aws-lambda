import { JwtPayload } from './JwtPayload'
import { JwtHeader } from 'jsonwebtoken'

/**
 * An interface representing a JWT Token
 */

export interface Jwt {
  header: JwtHeader
  payload: JwtPayload
}
