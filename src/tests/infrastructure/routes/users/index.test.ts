import { loadApp } from '@src/app'
import express from 'express'
import supertest from 'supertest'
import { mock } from 'jest-mock-extended'
import MockUtils from '@src/app/infrastructure/database/mocks'
import { cloneDeep, set } from 'lodash'
import { User } from '@src/app/domain/entities/user'
import { HttpStatusCode } from '@src/utils/httpStatusCodes'
import { UserModel } from '@src/app/infrastructure/input/user/interfaces'

const dummyUserModel: UserModel = {
  id_usuario: 1,
  nombre: 'fakeNombre',
  apellido: 'fakeApellido',
  nivel: 'fakeNuvel',
  imagen: 'fakeImageUrl'
}
const dummyUSerdomain: User = {
  id: 1,
  name: 'fakeNombre',
  lastName: 'fakeApellido',
  level: 'fakeNuvel',
  imageUrl: 'fakeImageUrl'
}

describe('Client route', () => {
  const app = express()
  const router = express.Router()
  const mockClient = mock<MockUtils>()
  const server = loadApp(app, router, mockClient)
  const apiRoute = '/api/v1/user'

  jest.spyOn(global.console, 'error').mockImplementation(() => {})

  beforeEach(() => {})

  afterEach(async () => {})
  it('Should return client data and status 200', async () => {
    mockClient.getUser.mockImplementation(() => Promise.resolve(dummyUserModel))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual(dummyUSerdomain)
      })
  })
  it('Should return an error and 404 if no client found', async () => {
    mockClient.getUser.mockImplementation(() => Promise.resolve({} as any))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(404)
      .then((response) => {
        expect(response.body.code).toBe('UserNotFound')
      })
  })
  it('Should return an error and 500 if error is thrown', async () => {
    let error = new Error()
    mockClient.getUser.mockImplementation(() => Promise.reject(error))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(HttpStatusCode.InternalServerError)
      .then((response) => {
        expect(response.body.code).toBe('GetUserError')
      })
  })
  it('Should return the error code if not found', async () => {
    let error = new Error('Not found')
    set(error, 'status', 404)
    mockClient.getUser.mockImplementation(() => Promise.reject(error))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(HttpStatusCode.NotFound)
      .then((response) => {
        expect(response.body.code).toBe('UserNotFound')
      })
  })
  it('Should return an error and 500 if schema validation fails', async () => {
    const dummyClientBadFormat = cloneDeep(dummyUserModel)
    dummyClientBadFormat.apellido = undefined as any
    mockClient.getUser.mockImplementation(() => Promise.resolve(dummyClientBadFormat))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(HttpStatusCode.BadRequest)
      .then((response) => {
        expect(response.body.code).toBe('ValidateSchemaError')
      })
  })
})
