import * as express from 'express';
import {
  ItemController_answerProposal_post,
  ItemController_create_post,
  ItemController_getAll_get,
  ItemController_getParticipantItems_get,
  ItemController_getParticipantProposals_get,
  ItemController_getTransportItems_get,
  ItemController_proposeTransfer_post,
  ItemController_transport_post,
  ItemController_deliverItem_post,
  ItemController_updateName_post,
  ItemController_updateQuality_post,
  ParticipantController_changeIdentity_post,
  ParticipantController_get_get,
  ParticipantController_getAll_get,
  ParticipantController_getByFingerprint_get,
  ParticipantController_register_post,
  User_getCertificate
} from './controllers'

export default express.Router()
  .post('/participant/register', ParticipantController_register_post)
  .post('/participant/changeIdentity', ParticipantController_changeIdentity_post)
  .get('/participant/get/:id', ParticipantController_get_get)
  .get('/participant/getByFingerprint/:fingerprint', ParticipantController_getByFingerprint_get)
  .get('/participant/getAll', ParticipantController_getAll_get)
  .get('/item/getAll', ItemController_getAll_get)
  .get('/item/getParticipantItems/:id', ItemController_getParticipantItems_get)
  .get('/item/getParticipantProposals/:id', ItemController_getParticipantProposals_get)
  .get('/item/getTransportItems/:id', ItemController_getTransportItems_get)
  .post('/item/add', ItemController_create_post)
  .post('/item/updateQuality', ItemController_updateQuality_post)
  .post('/item/updateName', ItemController_updateName_post)
  .post('/item/proposeTransfer', ItemController_proposeTransfer_post)
  .post('/item/transport', ItemController_transport_post)
  .post('/item/deliver', ItemController_deliverItem_post)
  .post('/item/answerProposal', ItemController_answerProposal_post)
  .get('/user/getCert/:org/:user', User_getCertificate)
