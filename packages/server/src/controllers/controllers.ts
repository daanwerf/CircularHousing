import {Request, Response} from 'express';
import {getAdapter} from '../convector';
import {resolve} from "path";
import {ClientFactory, Param} from '@worldsibu/convector-core';

import {networkProfile} from "../env";
import {ItemController} from "item-cc";
import {ParticipantController} from "participant-cc";
import * as yup from "yup";

// public async create(
//   @Param(yup.string())
// id: string,
// @Param(yup.string())
// name: string,
// @Param(yup.string())
// ownerID: string,
// @Param(yup.number())
// quality: string,
// @Param(yup.string())
// materials: string,
// ) {

export async function ItemController_create_post(req: Request, res: Response): Promise<void> {
  try {
    let params = req.body;
    console.log(JSON.stringify(params));
    let adp = await getAdapter(params.user, params.org, 'item', 'ch1');
    res.status(200).send(await ClientFactory(ItemController, adp).create(params.id, params.name, params.owner, params.quality, params.materials));

  } catch (ex) {
    console.log(JSON.stringify(ex));
    console.log('Error post ParticipantController_register', ex.stack);
    res.status(500).send(ex);
  }
}

export async function ItemController_getAll_get(req: Request, res: Response): Promise<void> {
  try {
    let params = req.params;

    console.log(JSON.stringify(params));
    console.log(resolve(__dirname, networkProfile(params.org)));
    let adp = await getAdapter(params.user, params.org, 'item', 'ch1');
    res.status(200).send(await ClientFactory(ItemController, adp).getAll());
  } catch (ex) {
    console.log('Error post ItemController_getAll_get', ex.stack);
    res.status(500).send(ex);
  }
}

export async function ParticipantController_register_post(req: Request, res: Response): Promise<void> {
  try {
    let params = req.body;
    console.log(JSON.stringify(params));
    console.log(resolve(__dirname, networkProfile(params.org)));
    let adp = await getAdapter(params.user, params.org, 'participant', 'ch1');
    res.status(200).send(await ClientFactory(ParticipantController, adp).register(params.id, params.name));

  } catch (ex) {
    console.log(JSON.stringify(ex));
    console.log('Error post ParticipantController_register', ex.stack);
    res.status(500).send(ex);
  }
}

export async function ParticipantController_get_get(req: Request, res: Response): Promise<void> {
  try {
    let params = req.params;
    console.log(JSON.stringify(params));
    console.log(resolve(__dirname, networkProfile(params.org)));

    let adp = await getAdapter(params.user, params.org, 'participant', 'ch1');
    res.status(200).send(await ClientFactory(ParticipantController, adp).get(params.id));

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

    let adp = await getAdapter(params.user, params.org, 'participant', 'ch1');
    res.status(200).send(await ClientFactory(ParticipantController, adp).getAll());
  } catch (ex) {
    console.log('Error get ParticipantController_getAll', ex.stack);
    res.status(500).send(ex);
  }
}
