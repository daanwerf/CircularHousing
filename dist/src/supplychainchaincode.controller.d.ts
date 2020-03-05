import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import { ConvectorController } from '@worldsibu/convector-core';
import { Supplychainchaincode } from './supplychainchaincode.model';
export declare class SupplychainchaincodeController extends ConvectorController<ChaincodeTx> {
    create(supplychainchaincode: Supplychainchaincode): Promise<void>;
}
