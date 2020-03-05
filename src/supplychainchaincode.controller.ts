import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { Supplychainchaincode } from './supplychainchaincode.model';

@Controller('supplychainchaincode')
export class SupplychainchaincodeController extends ConvectorController<ChaincodeTx> {
  @Invokable()
  public async create(
    @Param(Supplychainchaincode)
    supplychainchaincode: Supplychainchaincode
  ) {
    await supplychainchaincode.save();
  }
}