import fs from 'fs'
import { ApolloServer } from '@apollo/server'
import { resolvers } from './resolvers'
import { ErrorResponsePlugin, LoggerPlugin, ShutdownPlugin } from './plugins'

const typeDefs = fs.readFileSync('src/schema.gql', {
  encoding: 'utf8',
})

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ErrorResponsePlugin, LoggerPlugin, ShutdownPlugin],
})
