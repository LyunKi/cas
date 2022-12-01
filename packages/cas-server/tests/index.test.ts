import { createContext, redis } from '@cas-server/context'
import {
  SMS_CODE_EXPIRE,
  generateSmsCode,
} from '@cas-server/resolvers/sms'
import {
  generateSmsKey
} from '@cas-server/business'
import { server } from '@cas-server/server'

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
    const response = await server.executeOperation(
      {
        query: `mutation Mutation($req: SendSmsReq!) {
          sendSms(req: $req)
        }`,
        variables: {
          req: {
            mobile: testMobile,
          },
        },
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
