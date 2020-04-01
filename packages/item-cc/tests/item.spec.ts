// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';

import { Item, ItemController } from '../src';
import { Participant, ParticipantController } from 'participant-cc';

describe('Item', () => {  
  let adapter: MockControllerAdapter;
  let itemCtrl: ConvectorControllerClient<ItemController>;
  let participantCtrl: ConvectorControllerClient<ParticipantController>;
  
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

    adapter.addUser('Test');
  });
  
  it('should initialize an Item', async () => {
    const ownerID = "mockID";
    const ownerName = "mockName";
    const ownerMsp = "mockOrganisation";
    const ownerCertificate = 'B6:0B:37:7C:DF:D2:7A:08:0B:98:BF:52:A4:2C:DC:4E:CC:70:91:E1';

    await participantCtrl.$withUser('Test').register(ownerID, ownerName, ownerMsp, ownerCertificate);


    const itemName = "item1";
    const itemQuality = "Good";
    const materials = "mockMaterial1, mockMaterial2";

    const createdItem = await itemCtrl.$withUser('Test').create(itemName, ownerID, itemQuality, materials);
  
    const justSavedItem = await adapter.getById<Item>(createdItem.id);
    expect(justSavedItem.id).to.exist;
  });
});