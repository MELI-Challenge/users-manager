import express, { Express, Router } from 'express'
import cors from 'cors'
import { Config } from '@src/utils/interfaces'
import { routes } from './infrastructure/routes'
import { HttpStatusCode } from '@src/utils/httpStatusCodes'
import MockUtils from './infrastructure/database/mocks'

export const loadApp = (app: Express, router: Router, mockClient: MockUtils) => {
  app.use(cors())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  app.use('/health', (req, res) => res.status(HttpStatusCode.Ok).send({ imAlive: true }))
  app.use('/api/v1/', routes(router, mockClient))
  return app
}

export const startServer = (app: Express, config: Config) => {
  return app.listen(config.PORT, () => {
    console.log('[AppInit][AppLoad] App loaded')
  })
}
