import fs from 'fs'
import util from 'util'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { bootstrap as bootstrapGlobalAgent } from 'global-agent'
import { createContext } from './context'
import { resolvers } from './resolvers'

bootstrapGlobalAgent()

async function main() {
  const typeDefs = await util.promisify(fs.readFile)('src/schema.gql', {
    encoding: 'utf8',
  })

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  const port = (process.env['PORT'] ?? 4000) as number
  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: createContext,
  })

  console.log(`🚀  Server ready at: ${url}`)
}

main()
