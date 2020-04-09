// tslint:disable:no-unused-expression
import { join } from 'path';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';

import { Item, ItemController } from '../src';
import { Participant, ParticipantController } from 'participant-cc';

describe('Item', () => {
  chai.use(chaiAsPromised);
  let adapter: MockControllerAdapter;
  let itemCtrl: ConvectorControllerClient<ItemController>;
  let participantCtrl: ConvectorControllerClient<ParticipantController>;
  const mockIdentity = '8D:B9:F2:E7:77:CB:A9:A3:B9:0D:B7:C8:F1:FE:70:16:42:3B:BA:0D';
  const mockIdentity2 = 'DB:EE:E4:11:8B:AB:E1:7E:CF:BF:AF:E5:0D:47:4A:64:99:90:34:9E';
  const mockCertificate = '-----BEGIN CERTIFICATE-----' +
  'MIICjzCCAjWgAwIBAgIUITsRsw5SIJ+33SKwM4j1Dl4cDXQwCgYIKoZIzj0EAwIw' +
  'czELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh' +
  'biBGcmFuY2lzY28xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMT' +
  'E2NhLm9yZzEuZXhhbXBsZS5jb20wHhcNMTgwODEzMDEyOTAwWhcNMTkwODEzMDEz' +
  'NDAwWjBCMTAwDQYDVQQLEwZjbGllbnQwCwYDVQQLEwRvcmcxMBIGA1UECxMLZGVw' +
  'YXJ0bWVudDExDjAMBgNVBAMTBXVzZXIzMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcD' +
  'QgAEcrfc0HHq5LG1UbyPSRLNjIQKqYoNY7/zPFC3UTJi3TTaIEqgVL6DF/8JIKuj' +
  'IT/lwkuemafacXj8pdPw3Zyqs6OB1zCB1DAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0T' +
  'AQH/BAIwADAdBgNVHQ4EFgQUHFUlW/XJC7VcJe5pLFkz+xlMNpowKwYDVR0jBCQw' +
  'IoAgQ3hSDt2ktmSXZrQ6AY0EK2UHhXMx8Yq6O7XiA+X6vS4waAYIKgMEBQYHCAEE' +
  'XHsiYXR0cnMiOnsiaGYuQWZmaWxpYXRpb24iOiJvcmcxLmRlcGFydG1lbnQxIiwi' +
  'aGYuRW5yb2xsbWVudElEIjoidXNlcjMiLCJoZi5UeXBlIjoiY2xpZW50In19MAoG' +
  'CCqGSM49BAMCA0gAMEUCIQCNsmDjOXF/NvciSZebfk2hfSr/v5CqRD7pIHCq3lIR' +
  'lwIgPC/qGM1yeVinfN0z7M68l8rWn4M4CVR2DtKMpk3G9k9=' +
  '-----END CERTIFICATE-----';

  const mockAdmincertificate = "-----BEGIN CERTIFICATE-----\n" +
  "MIIC7DCCApOgAwIBAgIUcg3DffC8hY03iz6zRC6GZQUch7EwCgYIKoZIzj0EAwIw\n" +
  "cTELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\n" +
  "biBGcmFuY2lzY28xGDAWBgNVBAoTD29yZzEuaHVybGV5LmxhYjEbMBkGA1UEAxMS\n" +
  "Y2Eub3JnMS5odXJsZXkubGFiMB4XDTE5MDUwNjA4NDEwMFoXDTIwMDUwNTA4NDYw\n" +
  "MFowfzELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMRQwEgYD\n" +
  "VQQKEwtIeXBlcmxlZGdlcjEwMA0GA1UECxMGY2xpZW50MAsGA1UECxMEb3JnMTAS\n" +
  "BgNVBAsTC2RlcGFydG1lbnQxMQ8wDQYDVQQDEwZhZG1pbjIwWTATBgcqhkjOPQIB\n" +
  "BggqhkjOPQMBBwNCAATdhgd0fRPq4AYSvS9tiS7vcZamCG3PDAb0QM4UGyFADdWi\n" +
  "RsQjglz2/MnId4rLkU6srIAJUhDZI+QYGGkDhZlBo4H6MIH3MA4GA1UdDwEB/wQE\n" +
  "AwIHgDAMBgNVHRMBAf8EAjAAMB0GA1UdDgQWBBSbHq5DcRCcBt0+y4miDuzLOq80\n" +
  "8TArBgNVHSMEJDAigCD9XKUjIbuooHek1fmgbE768dWTkHdGpqGn8v/YEeBbyDAR\n" +
  "BgNVHREECjAIggZ1YnVudHUweAYIKgMEBQYHCAEEbHsiYXR0cnMiOnsiYWRtaW4i\n" +
  "OiJ0cnVlIiwiaGYuQWZmaWxpYXRpb24iOiJvcmcxLmRlcGFydG1lbnQxIiwiaGYu\n" +
  "RW5yb2xsbWVudElEIjoiYWRtaW4yIiwiaGYuVHlwZSI6ImNsaWVudCJ9fTAKBggq\n" +
  "hkjOPQQDAgNHADBEAiAzUQos0hPVPf3DuZaCW3gX+LlxL2G5d7iY1ZUh1murgwIg\n" +
  "dkQIssMaMwkireuglUubT/Chee4jFgnhJqffnG+qCHs=\n" +
  "-----END CERTIFICATE-----\n";

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
    (adapter.stub as any).usercert = mockAdmincertificate;
    adapter.stub['fingerprint'] = mockIdentity;
    await participantCtrl.register("mockID", "mockName", "mockOrganisation", mockIdentity);
    adapter.stub['fingerprint'] = mockIdentity2;
    await participantCtrl.register("mockID2", "mockName2", "mockOrganisation", mockIdentity2);
  });

  // Test for create item
  it('should create an Item', async () => {
    // Simulate being the user with id mockID
    adapter.stub['fingerprint'] = mockIdentity;
    const itemName = "item1";
    const ownerID = "mockID";
    const itemQuality = "Good";
    const materials = "mockMaterial1, mockMaterial2";

    await itemCtrl.create(itemName, ownerID, itemQuality, materials);
    const justSavedItem = await itemCtrl.getAll();

    expect(justSavedItem[0]).to.exist;
  });

  // Test for create item Event
  it('should have used the correct event type on the creation of Item', async () => {
    // Simulate being the user with id mockID
    adapter.stub['fingerprint'] = mockIdentity;
    const foundItem = await Item.query(Item, {
      'selector': {
        'name': "item1",
      }
    });
    const itemID = await foundItem[0].id;
    const retrievedItem = await adapter.getById<Item>(itemID);

    expect(retrievedItem.itemHistory[0].type).to.be.eql('CREATE');
  });

  // Test for create item
  it('should throw an error, as the owner doesnt exist', async () => {
    // Simulate being the user with id mockID
    adapter.stub['fingerprint'] = mockIdentity;
    const itemName = "item1";
    const ownerID = "mockIDNotExist";
    const itemQuality = "Good";
    const materials = "mockMaterial1, mockMaterial2";

    expect(itemCtrl.create(itemName, ownerID, itemQuality, materials).catch(e => e.responses[0].error.message)).to.be.eventually.eql('Given participant as owner does not currently exist on the ledger');
  });

  // Test for create item
  it('should throw an error, as the mocked user is not the owner of the item', async () => {
    // Simulate being the user with id mockID2
    adapter.stub['fingerprint'] = mockIdentity2;
    const itemName = "item1";
    const ownerID = "mockID";
    const itemQuality = "Good";
    const materials = "mockMaterial1, mockMaterial2";

    expect(itemCtrl.create(itemName, ownerID, itemQuality, materials).catch(e => e.responses[0].error.message)).to.be.eventually.eql('You are not allowed to do this action, only mockName is allowed to');
  });

  // Test for create item
  it('should throw an error, as the given quality is not of the allowed format', async () => {
    // Simulate being the user with id mockID2
    adapter.stub['fingerprint'] = mockIdentity2;
    const itemName = "item1";
    const ownerID = "mockID";
    const itemQuality = "WrongFormat";
    const materials = "mockMaterial1, mockMaterial2";

    expect(itemCtrl.create(itemName, ownerID, itemQuality, materials).catch(e => e.responses[0].error.message)).to.be.eventually.eql('Illegal argument given for quality.');
  });

  // Test for update name
  it('should update the name of an Item', async () => {
    // Simulate being the user with id mockID
    adapter.stub['fingerprint'] = mockIdentity;
    const foundItem = await Item.query(Item, {
      'selector': {
        'name': "item1",
      }
    });
    const itemID = await foundItem[0].id;

    const newName = "item1NewName";
    await itemCtrl.updateName(itemID, newName);

    const justUpdatedItem = await adapter.getById<Item>(itemID);
    expect(justUpdatedItem.name).to.be.eql("item1NewName");
  });

  // Test for rename item Event
  it('should have used the correct event type on the renaming of an Item', async () => {
    // Simulate being the user with id mockID
    adapter.stub['fingerprint'] = mockIdentity;
    const foundItem = await Item.query(Item, {
      'selector': {
        'name': "item1NewName",
      }
    });
    const itemID = await foundItem[0].id;
    const retrievedItem = await adapter.getById<Item>(itemID);

    expect(retrievedItem.itemHistory[1].type).to.be.eql('RENAME');
  });

  // Test for rename item
  it('should throw an error, as the item doesnt exist', async () => {
    // Simulate being the user with id mockID
    adapter.stub['fingerprint'] = mockIdentity;
    const itemID = "ItemIDNotExist"

    expect(itemCtrl.updateName(itemID, "item1NewName").catch(e => e.responses[0].error.message)).to.be.eventually.eql('Given item does not currently exist on the ledger');
  });

  // Test for rename item
  it('should throw an error, as this is not the owner of the item', async () => {
    // Simulate being the user with id mockID2
    adapter.stub['fingerprint'] = mockIdentity2;
    const foundItem = await Item.query(Item, {
      'selector': {
        'name': "item1NewName",
      }
    });
    const itemID = await foundItem[0].id;

    expect(itemCtrl.updateName(itemID, "item1NewName").catch(e => e.responses[0].error.message)).to.be.eventually.eql(`You are not allowed to do this action, only mockName is allowed to`);
  });

  // Test for update quality
  it('should update the quality of an Item', async () => {
    // Simulate being the user with id mockID
    adapter.stub['fingerprint'] = mockIdentity;
    const foundItem = await Item.query(Item, {
      'selector': {
        'name': "item1NewName",
      }
    });
    const itemID = await foundItem[0].id;

    const newQuality = "Bad";
    await itemCtrl.updateQuality(itemID, newQuality);

    const justUpdatedItem = await adapter.getById<Item>(itemID);
    expect(justUpdatedItem.quality).to.be.eql("Bad");
  });

  // Test for update quality item Event
  it('should have used the correct event type on the update of the quality of an Item', async () => {
    // Simulate being the user with id mockID
    adapter.stub['fingerprint'] = mockIdentity;
    const foundItem = await Item.query(Item, {
      'selector': {
        'name': "item1NewName",
      }
    });
    const itemID = await foundItem[0].id;
    const retrievedItem = await adapter.getById<Item>(itemID);

    expect(retrievedItem.itemHistory[3].type).to.be.eql('UPDATE');
  });

  // Test for update quality item
  it('should throw an error, as the item doesnt exist', async () => {
    // Simulate being the user with id mockID
    adapter.stub['fingerprint'] = mockIdentity;
    const itemID = "ItemIDNotExist"

    expect(itemCtrl.updateQuality(itemID, "Bad").catch(e => e.responses[0].error.message)).to.be.eventually.eql('Given item does not currently exist on the ledger');
  });

  // Test for update quality item
  it('should throw an error, as this is not the owner of the item', async () => {
    // Simulate being the user with id mockID2
    adapter.stub['fingerprint'] = mockIdentity2;
    const foundItem = await Item.query(Item, {
      'selector': {
        'name': "item1NewName",
      }
    });
    const itemID = await foundItem[0].id;

    expect(itemCtrl.updateQuality(itemID, "Bad").catch(e => e.responses[0].error.message)).to.be.eventually.eql(`You are not allowed to do this action, only mockName is allowed to`);
  });

  //Test for transfer ownership
  it('should propse a new owner of an Item', async () => {
    // Simulate being the user with id mockID
    adapter.stub['fingerprint'] = mockIdentity;
    const foundItem = await Item.query(Item, {
      'selector': {
        'name': "item1NewName",
      }
    });
    const itemID = await foundItem[0].id;

    const newOwner = "mockID2";

    await itemCtrl.proposeTransfer(itemID, newOwner);

    var justUpdatedItem = await adapter.getById<Item>(itemID);
    expect(justUpdatedItem.proposedOwner).to.be.eql("mockID2");
  });

  //Test for transfer ownership
  it('should accept ownership of an Item', async () => {
    // Simulate being the user with id mockID2
    adapter.stub['fingerprint'] = mockIdentity2;
    const foundItem = await Item.query(Item, {
      'selector': {
        'name': "item1NewName",
      }
    });
    const itemID = await foundItem[0].id;

    // The fingerprint obtained here is literally the one for mockID2 (also the same as mockIndentity2), still it says the wrong participant is used
    const newpart = await Participant.getOne("mockID2");
    const newpartidentity = newpart.identities.filter(identity => identity.status === true)[0];
    adapter.stub['fingerprint'] = newpartidentity.fingerprint;
    (adapter.stub as any).usercert = mockCertificate;

    await itemCtrl.answerProposal(itemID, true);

    var justUpdatedItem = await adapter.getById<Item>(itemID);

    expect(justUpdatedItem.itemOwner).to.be.eql("mockID2");
    expect(justUpdatedItem.proposedOwner).to.be.eql("");
  });

  // Test for transfer Item Event
  it('should have used the correct event type after the transfer of an Item', async () => {
    // Simulate being the user with id mockID
    const foundItem = await Item.query(Item, {
      'selector': {
        'name': "item1NewName",
      }
    });
    const itemID = await foundItem[0].id;
    const retrievedItem = await adapter.getById<Item>(itemID);

    expect(retrievedItem.itemHistory[4].type).to.be.eql('TRANSFER');
  });

  // Test for propose transfer item
  it('should throw an error, as the item doesnt exist', async () => {
    // Simulate being the user with id mockID
    adapter.stub['fingerprint'] = mockIdentity;
    const itemID = "ItemIDNotExist"

    expect(itemCtrl.proposeTransfer(itemID, "mockID").catch(e => e.responses[0].error.message)).to.be.eventually.eql('Given item does not currently exist on the ledger');
  });

  // Test for answer transfer item
  it('should throw an error, as the item doesnt exist', async () => {
    // Simulate being the user with id mockID
    adapter.stub['fingerprint'] = mockIdentity2;
    const itemID = "ItemIDNotExist"

    expect(itemCtrl.answerProposal(itemID, true).catch(e => e.responses[0].error.message)).to.be.eventually.eql('Given item does not currently exist on the ledger');
  });

  // Test for propose transfer item
  it('should throw an error, as this is not the owner of the item', async () => {
    // Simulate being the user with id mockID2
    adapter.stub['fingerprint'] = mockIdentity2;
    const foundItem = await Item.query(Item, {
      'selector': {
        'name': "item1NewName",
      }
    });
    const itemID = await foundItem[0].id;

    expect(itemCtrl.proposeTransfer(itemID, "mockID").catch(e => e.responses[0].error.message)).to.be.eventually.eql(`You are not allowed to do this action, only mockName is allowed to`);
  });

// Test for answer transfer item
it('should throw an error, as this is not the participant the proposal was made to', async () => {
  // First, successfully propose an item to participant mockName2, as mockName
  adapter.stub['fingerprint'] = mockIdentity;
  const foundItem = await Item.query(Item, {
    'selector': {
      'name': "item1NewName",
    }
  });
  const itemID = await foundItem[0].id;

  const newOwner = "mockID2";

  await itemCtrl.proposeTransfer(itemID, newOwner);

  // Try to answer proposal as the wrong user
  adapter.stub['fingerprint'] = "WrongIdentity";
  expect(itemCtrl.answerProposal(itemID, true).catch(e => e.responses[0].error.message)).to.be.eventually.eql(`You are not allowed to do this action, only mockName2 is allowed to`);
});



});
