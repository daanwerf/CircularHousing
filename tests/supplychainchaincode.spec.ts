// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';

import { Supplychainchaincode, SupplychainchaincodeController } from '../src';

describe('Supplychainchaincode', () => {
  let adapter: MockControllerAdapter;
  let supplychainchaincodeCtrl: ConvectorControllerClient<SupplychainchaincodeController>;
  
  before(async () => {
    // Mocks the blockchain execution environment
    adapter = new MockControllerAdapter();
    supplychainchaincodeCtrl = ClientFactory(SupplychainchaincodeController, adapter);

    await adapter.init([
      {
        version: '*',
        controller: 'SupplychainchaincodeController',
        name: join(__dirname, '..')
      }
    ]);

    adapter.addUser('Test');
  });
  
  it('should create a default model', async () => {
    const modelSample = new Supplychainchaincode({
      id: uuid(),
      name: 'Test',
      created: Date.now(),
      modified: Date.now()
    });

    await supplychainchaincodeCtrl.$withUser('Test').create(modelSample);
  
    const justSavedModel = await adapter.getById<Supplychainchaincode>(modelSample.id);
  
    expect(justSavedModel.id).to.exist;
  });
});