import fs from 'fs'
import { ApolloServer } from '@apollo/server'
import { createContext, redis } from '@cas-server/context'
import { resolvers } from '@cas-server/resolvers'
import {
  generateSmsKey,
  SMS_CODE_EXPIRE,
  generateSmsCode,
} from '@cas-server/resolvers/sms'

describe('Cas server', () => {
  const typeDefs = fs.readFileSync('src/schema.gql', {
    encoding: 'utf8',
  })
  const testServer = new ApolloServer({
    typeDefs,
    resolvers,
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('should start successfully', async () => {
    const response = await testServer.executeOperation(
      {
        query: 'query HealthCheck { ping }',
      },
      {
        contextValue: await createContext({
          req: { headers: { 'accept-language': 'en' } },
        }),
      }
    )
    expect(response.body.kind).toBe('single')
    expect((response.body as any).singleResult.errors).toBeUndefined()
    expect((response.body as any).singleResult.data.ping).toBe('pong')
  })

  it("should generate and cache a verification code for user's mobile", async () => {
    const spy = jest.spyOn(redis, 'setEx')
    const testMobile = '+8617766188133'
    const response = await testServer.executeOperation(
      {
        query: `
      mutation Mutation($mobile: String!) {
        sendSms(mobile: $mobile)
      }
      `,
        variables: { mobile: testMobile },
      },
      {
        contextValue: await createContext({
          req: { headers: { 'accept-language': 'en' } },
        }),
      }
    )
    expect(response.body.kind).toBe('single')
    expect((response.body as any).singleResult.errors).toBeUndefined()
    expect((response.body as any).singleResult.data.sendSms).toBe(testMobile)
    const testKey = generateSmsKey(testMobile)
    expect(spy).toHaveBeenCalledWith(
      testKey,
      SMS_CODE_EXPIRE,
      generateSmsCode(testMobile)
    )
    await redis.del(testKey)
  })
})
