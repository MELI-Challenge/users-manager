import { Response, Router } from 'express'
import { MakeMockDBOperations } from '@src/app/infrastructure/database'
import { ApiError, ApiResponse } from '@src/utils/interfaces'
import {
  handleDatabaseOperationError,
  mappingErrorHandler,
  mappingSuccessHandler
} from '../../input/utils/api-responses-handlers'
import { tryToMapUser } from '../../input/user'

const getUserHandler = async (res: Response, databaseOperations: MakeMockDBOperations) => {
  return databaseOperations
    .getUser()
    .thenMapFailure<ApiError>(handleDatabaseOperationError)
    .thenBindAsync<ApiResponse>((foundUser) => {
      return tryToMapUser(foundUser).thenMap<ApiResponse>(mappingSuccessHandler).thenMapFailure(mappingErrorHandler)
    })
    .then((r) =>
      r.either(
        (apiResponse) => {
          return res.status(apiResponse.status).send(apiResponse.payload)
        },
        (e) => {
          return res.status(e.status).send({
            type: e.type,
            code: e.code
          })
        }
      )
    )
}

export const getUserRoute = (router: Router, databaseOperations: MakeMockDBOperations): Router => {
  return router.get('/user', (req, res) => getUserHandler(res, databaseOperations))
}
