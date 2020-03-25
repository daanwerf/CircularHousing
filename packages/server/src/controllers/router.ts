import * as express from 'express';
import {
  ParticipantController_register_post,
  ParticipantController_changeIdentity_post,
  ParticipantController_get_get,
  ParticipantController_getAll_get,
  ItemController_create_post,
  ItemController_getAll_get,
  User_getCertificate,
  ParticipantController_getByFingerprint_get,
  ItemController_proposeTransfer_post,
  ItemController_answerProposal_post
} from './controllers'
export default express.Router()
	.post('/participant/register', ParticipantController_register_post)
	.post('/participant/changeIdentity', ParticipantController_changeIdentity_post)
	.get('/participant/get/:id', ParticipantController_get_get)
  .get('/participant/getByFingerprint/:fingerprint', ParticipantController_getByFingerprint_get)
	.get('/participant/getAll', ParticipantController_getAll_get)
	.get('/item/getAll', ItemController_getAll_get)
	.post('/item/add', ItemController_create_post)
  .get('/user/getCert/:org/:user', User_getCertificate)
  .post('/item/proposeTransfer', ItemController_proposeTransfer_post)
  .post('/item/answerProposal', ItemController_answerProposal_post)
