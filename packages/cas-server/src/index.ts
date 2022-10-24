import { startStandaloneServer } from '@apollo/server/standalone'
import { bootstrap as bootstrapGlobalAgent } from 'global-agent'
import { createContext } from './context'
import { server } from './server'

bootstrapGlobalAgent()

async function main() {
  const port = (process.env['PORT'] ?? 4000) as number
  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: createContext,
  })

  console.log(`🚀  Server ready at: ${url}`)
}

main()
