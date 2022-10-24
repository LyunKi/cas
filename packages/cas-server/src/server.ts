import fs from 'fs'
import { ApolloServer } from '@apollo/server'
import { redis } from './context'
import { resolvers } from './resolvers'

const typeDefs = fs.readFileSync('src/schema.gql', {
  encoding: 'utf8',
})

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    {
      async serverWillStart() {
        return {
          async serverWillStop() {
            await redis.disconnect()
          },
        }
      },
    },
  ],
})
