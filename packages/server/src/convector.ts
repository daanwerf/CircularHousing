import {resolve} from "path";
import {keyStore, networkProfile} from './env';
import {FabricControllerAdapter} from '@worldsibu/convector-adapter-fabric';
export async function getAdapter(identityName, identityOrg, chaincode, channel) {
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

  return adapter;
}
