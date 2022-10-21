import { PrismaClient } from '@prisma/client'
import { createClient } from 'redis'

const prisma = new PrismaClient()

const { REDIS_PASS } = process.env

export const redis = createClient({
  //redis[s]://[[username][:password]@][host][:port][/db-number]
  url: `redis://:${REDIS_PASS}@127.0.0.1/`,
})

export interface Context {
  prisma: PrismaClient
  redis: typeof redis
}

export async function createContext() {
  return { prisma, redis }
}
