import { Request, Response } from 'express';
import { getAdapter } from '../convector';
import { resolve } from "path";
import { ClientFactory, Param } from '@worldsibu/convector-core';

import { networkProfile } from "../env";
import { ItemController } from "item-cc";
import { ParticipantController } from "participant-cc";


export async function ParticipantController_register_post(req: Request, res: Response): Promise<void>{
    try { 
        let params = req.body;
        let query = req.query;
        let adp = await getAdapter(query.user, query.org);
        let fact = await ClientFactory(ParticipantController, adp)
            .register(params.id, params.name, params.msp, params.certificate);
        res.status(200).send(fact);
    } catch(ex) {
        console.log('Error post ParticipantController_register', ex.stack);
        res.status(500).send(ex);
    }
}

export async function ParticipantController_changeIdentity_post(req: Request, res: Response): Promise<void>{
    try {
        let params = req.body;
        let query = req.query;
        let adp = await getAdapter(query.user, query.org);
        let fact = await ClientFactory(ParticipantController, adp)
            .changeIdentity(params.id, params.newIdentity);
        res.status(200).send(fact);
            
    } catch(ex) {
        console.log('Error post ParticipantController_changeIdentity', ex.stack);
        res.status(500).send(ex);
    }
}

export async function ParticipantController_get_get(req: Request, res: Response): Promise<void>{
    try {
        let params = req.params;
        let query = req.query;
        let adp = await getAdapter(query.user, query.org);
        res.status(200).send(await ClientFactory(ParticipantController, adp).get(params.id));
    } catch (ex) {
        console.log('Error get ParticipantController_get', ex.stack);
        res.status(500).send(ex);
    }
}

export async function ParticipantController_getAll_get(req: Request, res: Response): Promise<void>{
    try {
        let params = req.params;
        let query = req.query;
        let adp = await getAdapter(query.user, query.org);
        res.status(200).send(await ClientFactory(ParticipantController, adp).getAll());
    } catch(ex) {
        console.log('Error get ParticipantController_getAll', ex.stack);
        res.status(500).send(ex);
    }
}

export async function ItemController_transfer_post(req: Request, res: Response): Promise<void> {
  try {
    let params = req.body;
    let query = req.query;
    let adp = await getAdapter(query.user, query.org);
    res.status(200).send(await ClientFactory(ItemController, adp)
        .transfer(params.id, params.newOwner));
  } catch (ex) {
    console.log(JSON.stringify(ex));
    console.log('Error post ParticipantController_register', ex.stack);
    res.status(500).send(ex);
  }
}

export async function ItemController_create_post(req: Request, res: Response): Promise<void> {
  try {
    let params = req.body;
    let query = req.query;
    let adp = await getAdapter(query.user, query.org);
    res.status(200).send(await ClientFactory(ItemController, adp)
        .create(params.id, params.name, params.owner, params.quality, params.materials));
  } catch (ex) {
    console.log(JSON.stringify(ex));
    console.log('Error post ParticipantController_register', ex.stack);
    res.status(500).send(ex);
  }
}

export async function ItemController_getAll_get(req: Request, res: Response): Promise<void> {
  try {
    let params = req.body;
    let query = req.query;
    let adp = await getAdapter(query.user, query.org);
    res.status(200).send(await ClientFactory(ItemController, adp).getAll());
  } catch (ex) {
    console.log('Error post ItemController_getAll_get', ex.stack);
    res.status(500).send(ex);
  }
}

// The below code is used to get the fingerprint (of a X509 certificate) belonging to
// a particular user from a particular organisation
const fs = require('fs');
const os = require('os');
const path = require('path');
const x509 = require('x509');

export async function User_getCertificate(req: Request, res: Response): Promise<void> {
    try {
        let params = req.params;
        let org = params.org;
        let user = params.user;
        let cert = JSON.parse(fs.readFileSync(path.resolve(os.homedir(), 
            'hyperledger-fabric-network/.hfc-' + org + '/' + user), 'utf8'))
            .enrollment.identity.certificate;
        var parsed = x509.parseCert(cert);
        res.status(200).send({'fingerprint': parsed.fingerPrint});
    } catch (ex) {
        console.log('Error get user certificate', ex.stack);
        res.status(500).send(ex);
    }
}