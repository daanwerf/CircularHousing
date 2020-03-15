import {Request, Response} from 'express';
import {backend} from '../convector';
import {resolve} from "path";
import {networkProfile} from "../env";


export async function ParticipantController_register_post(req: Request, res: Response): Promise<void> {
  try {
    let params = req.body;
    console.log(JSON.stringify(params));
    console.log(resolve(__dirname, networkProfile(params.org)));
    // const controller =
    // await controller
    res.status(200).send(await (await backend(params.user, params.org)).register(params.id, params.name));

  } catch (ex) {
    console.log('Error post ParticipantController_register', ex.stack);
    res.status(500).send(ex);
  }
}

export async function ParticipantController_get_get(req: Request, res: Response): Promise<void> {
  try {
    let params = req.params;
    console.log(JSON.stringify(params));
    console.log(resolve(__dirname, networkProfile(params.org)));

    res.status(200).send(await (await backend(params.user, params.org))
      .get(params.id));

  } catch (ex) {
    console.log('Error get ParticipantController_get', ex.stack);
    res.status(500).send(ex);
  }
}

export async function ParticipantController_getAll_get(req: Request, res: Response): Promise<void> {
  try {
    let params = req.params;
    console.log(JSON.stringify(params));
    console.log(resolve(__dirname, networkProfile(params.org)));

    res.status(200).send(await (await backend(params.user, params.org)).getAll());

  } catch (ex) {
    console.log('Error get ParticipantController_getAll', ex.stack);
    res.status(500).send(ex);
  }
}
