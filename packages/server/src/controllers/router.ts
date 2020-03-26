import * as express from 'express';
import { 
    ParticipantController_register_post,
    ParticipantController_changeIdentity_post,
    ParticipantController_get_get,
    ParticipantController_getByFingerprint_get,
    ParticipantController_getAll_get,
    ItemController_create_post,
    ItemController_updateQuality_post,
    ItemController_updateName_post,
  	ItemController_getAll_get,
  	ItemController_transfer_post,
    User_getCertificate
} from './controllers'
export default express.Router()
	.post('/participant/register', ParticipantController_register_post)
	.post('/participant/changeIdentity', ParticipantController_changeIdentity_post)
	.get('/participant/get/:id', ParticipantController_get_get)
  .get('/participant/getByFingerprint/:fingerprint', ParticipantController_getByFingerprint_get)
	.get('/participant/getAll', ParticipantController_getAll_get)
	.get('/item/getAll', ItemController_getAll_get)
	.post('/item/add', ItemController_create_post)
  .post('/item/updateQuality', ItemController_updateQuality_post)
  .post('/item/updateName', ItemController_updateName_post)
  .post('/item/transfer', ItemController_transfer_post)
  .get('/user/getCert/:org/:user', User_getCertificate)