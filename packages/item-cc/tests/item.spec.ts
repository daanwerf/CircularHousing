// tslint:disable:no-unused-expression
import { join } from 'path';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';

import { Item, ItemController } from '../src';
import {ParticipantController} from "participant-cc";

describe('Item', () => {
  chai.use(chaiAsPromised);
  let adapter: MockControllerAdapter;
  let itemCtrl: ConvectorControllerClient<ItemController>;
  let participantCtrl: ConvectorControllerClient<ParticipantController>;
  const itemId1 = 'itemID1';

  before(async () => {
    // Mocks the blockchain execution environment
    adapter = new MockControllerAdapter();
    itemCtrl = ClientFactory(ItemController, adapter);
    participantCtrl = ClientFactory(ParticipantController, adapter);

    await adapter.init([
      {
        version: '*',
        controller: 'ItemController',
        name: join(__dirname, '..')
      },
      {
        version: '*',
        controller: 'ParticipantController',
        name: join(__dirname, '../../participant-cc')
      }
    ]);

    await adapter.addUser('PersonA');
    await adapter.addUser('PersonB');
    await participantCtrl.$withUser('PersonA').register('id1', 'PersonA');
    // await participantCtrl.register('id2', 'Person B');
  });

  it('should be created', async () => {
    await itemCtrl.$withUser('PersonA').create(itemId1,
      'TestItem',
      'id1',
      'Usable',
      'A,B');

    const justSavedModel = await adapter.getById<Item>(itemId1);

    expect(justSavedModel.id).to.exist;
  });

  it('should update its name', async () => {
    await itemCtrl.$withUser('PersonA').updateName(itemId1, 'New name');
    const item = await adapter.getById<Item>(itemId1);
    expect(item.name).to.equal('New name');
    //Test non-owner
    await expect(itemCtrl.$withUser('PersonB').updateName(itemId1, 'Name2')).to.be.eventually
      .rejectedWith(Error);
  });

});
