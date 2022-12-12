import { Failure, Result, ResultPromise, Success } from '@src/utils/result'
import { get, isEmpty } from 'lodash'
import { UserModel } from '../input/user/interfaces'
import { databaseOperationErrorHandler } from './errors/error-handler'
import { DatabaseOperationError } from './errors/interfaces'
import MockUtils from './mocks'

export interface MakeMockDBOperations {
  getUser: () => ResultPromise<UserModel, DatabaseOperationError>
}

export const loadMockDBClient = (): Result<MockUtils, unknown> => {
  const mockUtils = new MockUtils()
  return Success(mockUtils)
}

const handleDatabaseSuccess = <T>(r: any, notFoundHandler: () => DatabaseOperationError) => {
  return isEmpty(r) ? Failure<T, DatabaseOperationError>(notFoundHandler()) : Success<T, DatabaseOperationError>(r)
}

const handleDatabaseError = <T>(
  e: any,
  notFoundHandler: () => DatabaseOperationError,
  errorHandler: () => DatabaseOperationError
) => {
  const status = get(e, 'status')
  const error = status === 404 ? notFoundHandler() : errorHandler()
  return Failure<T, DatabaseOperationError>(error)
}

export const makeMockDBOperations = (mockUtils: MockUtils): MakeMockDBOperations => {
  const getUser = (): ResultPromise<UserModel, DatabaseOperationError> => {
    return ResultPromise.fromPromise<UserModel, DatabaseOperationError>(
      Promise.resolve(
        mockUtils
          .getUser()
          .then((r) => handleDatabaseSuccess<UserModel>(r, databaseOperationErrorHandler.onUserNotFound))
          .catch((e) =>
            handleDatabaseError<UserModel>(
              e,
              databaseOperationErrorHandler.onUserNotFound,
              databaseOperationErrorHandler.onGetUserError
            )
          )
      )
    )
  }
  return {
    getUser
  }
}
