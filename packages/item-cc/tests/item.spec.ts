// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';

import { Item, ItemController } from '../src';

describe('Item', () => {
  let adapter: MockControllerAdapter;
  let itemCtrl: ConvectorControllerClient<ItemController>;
  
  before(async () => {
    // Mocks the blockchain execution environment
    adapter = new MockControllerAdapter();
    itemCtrl = ClientFactory(ItemController, adapter);

    await adapter.init([
      {
        version: '*',
        controller: 'ItemController',
        name: join(__dirname, '..')
      }
    ]);

    adapter.addUser('Test');
  });
  
  it('should create a default model', async () => {
    const modelSample = new Item({
      id: uuid(),
      name: 'Test',
      created: Date.now(),
      modified: Date.now()
    });

    await itemCtrl.$withUser('Test').create(modelSample);
  
    const justSavedModel = await adapter.getById<Item>(modelSample.id);
  
    expect(justSavedModel.id).to.exist;
  });
});