import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { COMPANY, TOKEN_DURATION_SECONDS } from './constants'

const ALGORITHM = 'aes-256-ctr'

export function encrypt(text: string) {
  const pass = process.env['CRYPTO_PASS']
  if (!pass) {
    throw new Error('CRYPTO_PASS env is not provided')
  }
  const cipher = crypto.createCipher(ALGORITHM, pass)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

export function decrypt(text: string) {
  const pass = process.env['CRYPTO_PASS']
  if (!pass) {
    throw new Error('CRYPTO_PASS env is not provided')
  }
  const decipher = crypto.createDecipher(ALGORITHM, pass)
  let decrypted = decipher.update(text, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

export function encodeJwt(data: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const secret = process.env['JWT_SECRET']
    if (!secret) {
      reject(new Error('JWT_SECRET env is not provided'))
      return
    }
    jwt.sign(
      data,
      secret,
      {
        expiresIn: `${TOKEN_DURATION_SECONDS}s`,
        issuer: COMPANY,
      },
      (error, encoded) => {
        if (error || !encoded) {
          reject(error ?? 'Failed to encodeJwt')
          return
        }
        resolve(encoded)
      }
    )
  })
}

export function verifyJwt<T = any>(encoded: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const secret = process.env['JWT_SECRET']
    if (!secret) {
      reject(new Error('JWT_SECRET env is not provided'))
      return
    }
    jwt.verify(
      encoded,
      secret,
      {
        issuer: COMPANY,
      },
      (error, decoded) => {
        if (error) {
          reject(error)
          return
        }
        resolve(decoded as T)
      }
    )
  })
}
