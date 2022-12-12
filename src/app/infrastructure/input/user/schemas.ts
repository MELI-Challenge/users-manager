import joi from '@hapi/joi'
import { UserModel } from './interfaces'

export const userValidateSchema = joi.object<UserModel>({
  id_usuario: joi.number().required(),
  nombre: joi.string().required(),
  apellido: joi.string().required(),
  nivel: joi.string().required(),
  imagen: joi.string().required()
})
