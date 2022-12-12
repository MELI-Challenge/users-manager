import { Server, IncomingMessage, ServerResponse } from 'http'
const logPrefix = '[GracefulShutdown]'

const shutdown = (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
  try {
    console.log(`${logPrefix} Closing server`)
    server.close()
  } catch (e) {
    console.log(`${logPrefix} Graceful shutdown failed: ${JSON.stringify(e)}`)
  } finally {
    console.log(`${logPrefix} Graceful shutdown done`)
  }
  process.exit(0)
}

export const gracefulShutdown = (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
  const signalTraps: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2']
  signalTraps.forEach((type) => process.once(type, async () => shutdown(server)))
}
