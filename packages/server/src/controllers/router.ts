import * as express from 'express';
import {
  ItemController_create_post,
  ItemController_getAll_get,
  ParticipantController_get_get,
  ParticipantController_getAll_get,
  ParticipantController_register_post
} from './controllers'

export default express.Router()
  .post('/participant/register', ParticipantController_register_post)
  .get('/participant/get/:id', ParticipantController_get_get)
  .get('/participant/getAll/:org/:user', ParticipantController_getAll_get)
  .get('/item/getAll/:org/:user', ItemController_getAll_get)
  .post('/item/add', ItemController_create_post)
