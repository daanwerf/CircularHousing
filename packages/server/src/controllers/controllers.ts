import { Request, Response } from 'express';
import { getAdapter } from '../convector';
import { resolve } from "path";
import { ClientFactory, Param } from '@worldsibu/convector-core';

import { networkProfile } from "../env";
import { ItemController } from "item-cc";
import { ParticipantController } from "participant-cc";

function parseError(errMess) {
    let startErr = '"message":"';
    return errMess.substring(
        errMess.lastIndexOf(startErr) + startErr.length,
        errMess.lastIndexOf('"}')
    );
}

export async function ParticipantController_register_post(req: Request, res: Response): Promise<void>{
    try { 
        let params = req.body;
        let query = req.query;
        let adp = await getAdapter(query.user, query.org);
        let fact = await ClientFactory(ParticipantController, adp)
            .register(params.id, params.name, params.msp, params.certificate);
        res.status(200).send(fact);
    } catch(ex) {
        console.log(ex.message); 
        res.statusMessage = parseError(ex.message);
        res.status(500).end();
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
        console.log(ex.message); 
        res.statusMessage = parseError(ex.message);
        res.status(500).end();
    }
}

export async function ParticipantController_get_get(req: Request, res: Response): Promise<void>{
    try {
        let params = req.params;
        let query = req.query;
        let adp = await getAdapter(query.user, query.org);
        res.status(200).send(await ClientFactory(ParticipantController, adp).get(params.id));
    } catch (ex) {
        console.log(ex.message); 
        res.statusMessage = parseError(ex.message);
        res.status(500).end();
    }
}

export async function ParticipantController_getByFingerprint_get(req : Request, res : Response): 
        Promise<void> {
    try {
        let params = req.params;
        let query = req.query;
        let adp = await getAdapter(query.user, query.org);
        res.status(200).send(await ClientFactory(ParticipantController, adp)
            .getByFingerprint(params.fingerprint));
    } catch (ex) {
        console.log(ex.message); 
        res.statusMessage = parseError(ex.message);
        res.status(500).end();
    }
}

export async function ParticipantController_getAll_get(req: Request, res: Response): Promise<void>{
    try {
        let params = req.params;
        let query = req.query;
        let adp = await getAdapter(query.user, query.org);
        res.status(200).send(await ClientFactory(ParticipantController, adp).getAll());
    } catch(ex) {
        console.log(ex.message); 
        res.statusMessage = parseError(ex.message);
        res.status(500).end();
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
        console.log(ex.message); 
        res.statusMessage = parseError(ex.message);
        res.status(500).end();
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
        console.log(ex.message); 
        res.statusMessage = parseError(ex.message);
        res.status(500).end();
  }
}

export async function ItemController_updateQuality_post(req : Request, res : Response): Promise<void> {
    try {
        let params = req.body;
        let query = req.query;
        let adp = await getAdapter(query.user, query.org);
        res.status(200).send(await ClientFactory(ItemController, adp)
            .updateQuality(params.id, params.quality));
    } catch (ex) {
        console.log(ex.message); 
        res.statusMessage = parseError(ex.message);
        res.status(500).end();
    } 
}

export async function ItemController_updateName_post(req : Request, res : Response): Promise<void> {
    try {
        let params = req.body;
        let query = req.query;
        let adp = await getAdapter(query.user, query.org);
        res.status(200).send(await ClientFactory(ItemController, adp)
            .updateName(params.id, params.name));
    } catch (ex) {
        console.log(ex.message); 
        res.statusMessage = parseError(ex.message);
        res.status(500).end();
    } 
}

export async function ItemController_getAll_get(req: Request, res: Response): Promise<void> {
  try {
    let query = req.query;
    let adp = await getAdapter(query.user, query.org);
    res.status(200).send(await ClientFactory(ItemController, adp).getAll());
  } catch (ex) {
        console.log(ex.message); 
        res.statusMessage = parseError(ex.message);
        res.status(500).end();
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