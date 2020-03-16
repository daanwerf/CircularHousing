import * as express from 'express';
import {
    ParticipantController_register_post,
    ParticipantController_get_get,
    ParticipantController_getAll_get } from './controllers'
export default express.Router()
.post('/participant/register', ParticipantController_register_post)
.get('/participant/get/:id', ParticipantController_get_get)
.get('/participant/getAll/:org/:user', ParticipantController_getAll_get)
