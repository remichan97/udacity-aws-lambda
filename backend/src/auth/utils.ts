import { decode } from 'jsonwebtoken'
import { JwtPayload } from "../JwtModels/JwtPayload.ts"
import { JwtKey } from "../JwtModels/JwtKey.ts"
import { SigningKey } from "../JwtModels/SigningKey.ts"

import * as https from "https"
import axios from "axios"

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken) {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}

export async function getJwtKey(options: { jwtUri: string; strictSsl: boolean;}): Promise<JwtKey[] | null> {
  const instance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: options.strictSsl,
    })
  });

  try {
    const response = await instance.get(options.jwtUri, {
      headers: {
        'Content-Type': 'application/json'
      },
    });

    return response.data.keys;
  } catch (e) {
    console.log(e);
    return null;
  }
}

function certToPEM(cert: string) {
  // @ts-expect-error cert might be null
  cert = cert.match(/.{1,64}/g).join('\n');
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
  return cert;
}

export async function getSigningKey(jwtUri: string, kid: string): Promise<SigningKey> {
  const keys = await getJwtKey({
    jwtUri,
    strictSsl: false,
  });
  if (!keys || !keys.length) {
    return null!;
  }

  const signingKeys = keys.filter(key => key.use === 'sig'
    && key.kty === 'RSA'
    && key.kid
    && (key.x5c && key.x5c.length) || (key.n && key.e)).map(key => ({
    kid: key.kid,
    publicKey: certToPEM(key.x5c[0])
  }));

  const signingKey = signingKeys.find(key => key.kid === kid);
  if (!signingKey) {
    return null!;
  }

  return signingKey;
}