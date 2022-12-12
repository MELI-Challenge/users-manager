import { User } from '@src/app/domain/entities/user'
import { ResultPromise } from '@src/utils/result'
import { validateSchema, ValidateSchemaError } from '@src/utils/schema'
import { UserModel } from './interfaces'
import { userValidateSchema } from './schemas'

export const tryToMapUser = (userModel: UserModel): ResultPromise<User, ValidateSchemaError> => {
  return ResultPromise.fromResult(
    validateSchema(userValidateSchema, userModel)
      .mapFailure((e) => e)
      .map<User>((r) => ({
        id: r.id_usuario,
        name: r.nombre,
        lastName: r.apellido,
        level: r.nivel,
        imageUrl: r.imagen
      }))
  )
}
