import { ApolloServer } from '@apollo/server'
import { resolvers } from '@cas-server/resolvers'
import fs from 'fs'

describe('Cas server', () => {
  const typeDefs = fs.readFileSync('src/schema.gql', {
    encoding: 'utf8',
  })
  const testServer = new ApolloServer({
    typeDefs,
    resolvers,
  })
  it('should start successfully', async () => {
    const response = await testServer.executeOperation({
      query: 'query healthCheck { ping }',
    })
    expect(response.body.kind).toBe('single')
    expect((response.body as any).singleResult.errors).toBeUndefined()
    expect((response.body as any).singleResult.data.ping).toBe('pong')
  })
})
