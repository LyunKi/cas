import fs from 'fs'
import { ApolloServer } from '@apollo/server'
import { DateTimeTypeDefinition, DateTimeResolver } from 'graphql-scalars'
import { resolvers } from './resolvers'
import { ErrorResponsePlugin, LoggerPlugin, ShutdownPlugin } from './plugins'

const typeDefs = fs.readFileSync('src/schema.gql', {
  encoding: 'utf8',
})

export const server = new ApolloServer({
  typeDefs: [DateTimeTypeDefinition, typeDefs],
  resolvers: {
    DateTime: DateTimeResolver,
    ...resolvers,
  },
  plugins: [ErrorResponsePlugin, LoggerPlugin, ShutdownPlugin],
})
