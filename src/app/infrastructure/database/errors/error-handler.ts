import { DatabaseOperationError } from './interfaces'

export const databaseOperationErrorHandler = {
  onUserNotFound: (): DatabaseOperationError => {
    console.error('[InfrastructureFailure] UserNotFound')
    return {
      type: 'InfrastructureFailure',
      code: 'UserNotFound'
    }
  },
  onGetUserError: (): DatabaseOperationError => {
    console.error('[InfrastructureFailure] GetUserError')
    return {
      type: 'InfrastructureFailure',
      code: 'GetUserError'
    }
  }
}
