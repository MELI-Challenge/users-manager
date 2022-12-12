import express, { Express } from 'express'
import { loadApp, startServer } from '@src/app'
import { loadMockDBClient } from '@src/app/infrastructure/database'
import { loadAndValidateConfig } from '@utils/config'
import { gracefulShutdown } from '@utils/gracefulshutdown'
import MockUtils from './app/infrastructure/database/mocks'
import { Config } from './utils/interfaces'

const app = express()
const router = express.Router()

const loadServer = (app: Express, router: express.Router, config: Config, mockClient: MockUtils) => {
  const loadedApp = loadApp(app, router, mockClient)
  const server = startServer(loadedApp, config)
  gracefulShutdown(server)
}

loadAndValidateConfig()
  .bind((config) => {
    console.log('[AppInit][DBLoad] Database loading')
    return loadMockDBClient()
      .mapFailure((e) => {
        console.error(`[AppInit][DBLoad] Database failed to load ${JSON.stringify(e, null, 2)}`)
        return JSON.stringify(e)
      })
      .map(() => config)
  })
  .either(
    (config) => {
      console.log(`[AppInit][AppLoad] App loading in port ${config.PORT}`)
      const mockClient = new MockUtils()
      loadServer(app, router, config, mockClient)
      return
    },
    (e) => {
      console.error(`[AppInit][AppLoadError] App could not load: ${JSON.stringify(e, null, 2)}`)
      process.exit(0)
    }
  )
