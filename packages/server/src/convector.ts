import {resolve} from "path";
import {keyStore, networkProfile} from './env';
import {FabricControllerAdapter} from '@worldsibu/convector-adapter-fabric';
import {ClientFactory} from '@worldsibu/convector-core';
import {ParticipantController} from 'participant-cc';
import {ItemController} from "item-cc";
import {ConvectorControllerClient} from "@worldsibu/convector-core-adapter/dist/src/controller-client";

export async function backend(identityName, identityOrg, controller, chaincode, channel) : Promise<ConvectorControllerClient<any>> {
  const keystorePath = keyStore(identityOrg);
  const networkProfilePath = networkProfile(identityOrg);

  let adapter = new FabricControllerAdapter({
    txTimeout: 300000,
    user: identityName,
    channel: channel,
    chaincode: chaincode,
    keyStore: resolve(__dirname, keystorePath),
    networkProfile: resolve(__dirname, networkProfilePath),
    userMspPath: resolve(__dirname, keystorePath)
  });

  await adapter.init();

  return ClientFactory(controller, adapter);
}

export const ParticipantControllerBackend = function(identityName, identityOrg) {
  return backend(identityName, identityOrg, ParticipantController, 'participant', 'ch1');
};

export const itemControllerBackend = function(identityName, identityOrg) {
  return backend(identityName, identityOrg, ItemController, 'item', 'ch1');
}
