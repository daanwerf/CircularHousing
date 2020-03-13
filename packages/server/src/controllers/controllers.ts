import { Request, Response } from 'express';
import { ParticipantControllerBackEnd } from '../convector';


export async function ParticipantController_register_post(req: Request, res: Response): Promise<void>{
    try{
        let params = req.body;
            res.status(200).send(await ParticipantControllerBackEnd
                .register(params.id,params.name));

    } catch(ex) {
        console.log('Error post ParticipantController_register', ex.stack);
        res.status(500).send(ex);
    }
}
export async function ParticipantController_get_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await ParticipantControllerBackEnd
            .get(params.id));

    } catch(ex) {
        console.log('Error get ParticipantController_get', ex.stack);
        res.status(500).send(ex);
    }
}
export async function ParticipantController_getAll_get(req: Request, res: Response): Promise<void>{
    try{
        let params = req.params;
        res.status(200).send(await ParticipantControllerBackEnd
            .getAll());

    } catch(ex) {
        console.log('Error get ParticipantController_getAll', ex.stack);
        res.status(500).send(ex);
    }
}
