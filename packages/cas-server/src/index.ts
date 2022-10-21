import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { createContext, redis } from './context'
import fs from 'fs'
import util from 'util'
import { resolvers } from './resolvers'

async function main() {
  const typeDefs = await util.promisify(fs.readFile)('src/schema.gql', {
    encoding: 'utf8',
  })

  await redis.connect()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: createContext,
  })

  console.log(`🚀  Server ready at: ${url}`)
}

main()
