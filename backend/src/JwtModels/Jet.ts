import { JwtHeader } from "jsonwebtoken"
import  { JwtPayload } from "./JwtPayload.ts"

export interface JwtTokwn {
	header: JwtHeader
	payload: JwtPayload
}