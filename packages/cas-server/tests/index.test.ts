import path from 'path'
import { createContext, redis } from '@cas-server/context'
import {
  generateSmsKey,
  SMS_CODE_EXPIRE,
  generateSmsCode,
} from '@cas-server/resolvers/sms'
import dotenv from 'dotenv'
import { server } from '@cas-server/server'

dotenv.config({
  path: path.resolve(process.cwd(), '.env.test'),
  override: true,
})

describe('Cas server', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  afterAll(async () => {
    await server.stop()
  })
  it('should start successfully', async () => {
    const response = await server.executeOperation(
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
    const response = await server.executeOperation({
      query: `
      mutation Mutation($mobile: String!) {
        sendSms(mobile: $mobile)
      }
      `,
      variables: { mobile: testMobile },
    })
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
