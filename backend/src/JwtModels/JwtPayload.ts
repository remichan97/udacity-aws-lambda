/**
 * JWT Token Payload
 */

export interface JwtPayload {
  iss?: string
  sub?: string
  iat?: number
  exp?: number
}
