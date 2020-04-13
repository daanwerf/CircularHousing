// tslint:disable:no-unused-expression
import { join } from 'path';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';
import { Participant, ParticipantController } from '../src';

describe('Participant', () => {
  chai.use(chaiAsPromised);
  let adapter: MockControllerAdapter;
  let participantCtrl: ConvectorControllerClient<ParticipantController>;
  const mockIdentity = 'B6:0B:37:7C:DF:D2:7A:08:0B:98:BF:52:A4:2C:DC:4E:CC:70:91:E1';
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

    const mockIdentity2 = '66:D1:49:80:C8:AF:09:48:6E:0E:5F:0A:CA:EE:87:CB:16:C4:78:61';
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
    participantCtrl = ClientFactory(ParticipantController, adapter);

    await adapter.init([
      {
        version: '*',
        controller: 'ParticipantController',
        name: join(__dirname, '..')
      }
    ]);
    (adapter.stub as any).usercert = mockCertificate;
  });
  
  // Test for Participant create
  it('should not be allowed, as only the chaincodeAdmin can create a participant', async () => {
    const type = 'participant';
    const id = 'mockID';
    const name = 'mockName';
    const msp = 'mockOrganisation';

    await expect(participantCtrl.register(type, id, name, msp, mockIdentity).catch(e => e.responses[0].error.message)).to.be.eventually
      .eql('Unauthorized. Only admin can create a new participant.');
  });

  // Test for Participant create
  it('should not be possible to create a participant with a wrong type', async () => {
    const type = 'wrongType';
    const id = 'mockIDWrong';
    const name = 'mockNameWrong';
    const msp = 'mockOrganisation';

    (adapter.stub as any).usercert = mockAdmincertificate;
    await expect(participantCtrl.register(type, id, name, msp, mockIdentity)).to.be.eventually.rejectedWith(Error);
  });

  // Test for Participant create
  it('should create a new general participant', async () => {
    const type = 'participant';
    const id = 'mockID';
    const name = 'mockName';
    const msp = 'mockOrganisation';

    (adapter.stub as any).usercert = mockAdmincertificate;
    await participantCtrl.register(type, id, name, msp, mockIdentity);
  
    const justSavedModel = await adapter.getById<Participant>(id);
    expect(justSavedModel.id).to.exist;
  });

  // Test for Participant create
  it('should not be possible to create a second participant for the same user', async () => {
    const type = 'participant';
    const id = 'mockID2';
    const name = 'mockName2';
    const msp = 'mockOrganisation';

    (adapter.stub as any).usercert = mockAdmincertificate;
    await expect(participantCtrl.register(type, id, name, msp, mockIdentity).catch(e => e.responses[0].error.message)).to.be.eventually
      .eql('This user already has a participant on the blockchain.' +
      'You can only create one participant for each node');
  });

  // Test for Participant create
  it('should not be possible to create a participant with the same id', async () => {
    const type = 'participant';
    const id = 'mockID';
    const name = 'mockName2';
    const msp = 'mockOrganisation';

    (adapter.stub as any).usercert = mockAdmincertificate;
    await expect(participantCtrl.register(type, id, name, msp, mockIdentity2).catch(e => e.responses[0].error.message)).to.be.eventually
      .eql('Identity exists already, please call changeIdentity fn for updates');
  });

  // Test for Participant create
  it('should be possible to create a participant for the new user', async () => {
    const type = 'participant';
    const id = 'mockID2';
    const name = 'mockName2';
    const msp = 'mockOrganisation';

    (adapter.stub as any).usercert = mockAdmincertificate;
    await participantCtrl.register(type, id, name, msp, mockIdentity2);
  
    const justSavedModel = await adapter.getById<Participant>(id);
    expect(justSavedModel.id).to.exist;
  });

  // Test for Participant changeIdentity
  it('should not be able to change identity, only the admin is allowed to', async () => {
    const id = 'mockID';
    const fake_cert = '56:74:69:D7:D7:C5:A4:A4:C5:2D:4B:7B:7B:27:A9:6A:A8:6A:C9:26:FF:8B:82';    ;

    (adapter.stub as any).usercert = mockCertificate;
    await expect(participantCtrl.changeIdentity(id, fake_cert).catch(e => e.responses[0].error.message)).to.be.eventually.eql('Unauthorized. Requester identity is not an admin');
  });

  // Test for Participant changeIdentity
  it('should not be able to change identity, as this identity does not exist', async () => {
    const id = 'mockIDNotExist';
    const fake_cert = '56:74:69:D7:D7:C5:A4:A4:C5:2D:4B:7B:7B:27:A9:6A:A8:6A:C9:26:FF:8B:82';    ;

    (adapter.stub as any).usercert = mockAdmincertificate;
    await expect(participantCtrl.changeIdentity(id, fake_cert).catch(e => e.responses[0].error.message)).to.be.eventually.eql('No identity exists with that ID');
  });

  // Test for Participant changeIdentity
  it('should be able to change identity', async () => {
    const id = 'mockID';
    const fake_cert = '56:74:69:D7:D7:C5:A4:A4:C5:2D:4B:7B:7B:27:A9:6A:A8:6A:C9:26:FF:8B:82';

    (adapter.stub as any).usercert = mockAdmincertificate;
    await participantCtrl.changeIdentity(id, fake_cert);

    const userExisting = await Participant.query(Participant, {
      'selector': {
        'identities': {
          '$elemMatch': {
            'fingerprint': fake_cert,
            'status': true
          }
        }
      }
    });
    expect(userExisting[0] !== undefined);
  });

  // Test for Participant getByFingerprint
  it('should return an existing participant', async () => {
    const fingerprint = '56:74:69:D7:D7:C5:A4:A4:C5:2D:4B:7B:7B:27:A9:6A:A8:6A:C9:26:FF:8B:82';
    const retrievedParticipant = participantCtrl.getByFingerprint(fingerprint);
    expect(retrievedParticipant).to.exist;
  });

  // Test for Participant getByFingerprint
  it('should return an empty list, as no participants for this fingerprint exist', async () => {
    const fingerprintNotExist = '23:74:69:D7:D7:C5:A4:A4:C5:2D:4B:7B:7B:27:A9:6A:A8:6A:C9:26:FF:8B:82';
    const retrievedParticipant = participantCtrl.getByFingerprint(fingerprintNotExist);
    expect(retrievedParticipant).to.not.eventually.be.eql({});
  });

  // Test for Participant get
  it('should return a participant', async () => {
    const id = 'mockID';
    const retrievedParticipant = participantCtrl.get(id);
    expect(retrievedParticipant).to.exist;
  });

  // Test for Participant get
  it('should not return a participant', async () => {
    const id = 'mockIDNotExist';
    await expect(participantCtrl.get(id).catch(e => e.responses[0].error.message)).to.be.eventually.eql('No identity exists with id ' + id);
  });
});