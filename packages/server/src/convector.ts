import { join, resolve } from "path";
import { keyStore, channel, chaincode, networkProfile } from './env';
import { FabricControllerAdapter } from '@worldsibu/convector-adapter-fabric';

export async function getAdapter(identityName, identityOrg) {
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

    