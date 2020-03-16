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
  // A fake certificate to emulate multiple wallets
  const fakeSecondParticipantCert = '-----BEGIN CERTIFICATE-----' +
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
  let adapter: MockControllerAdapter;
  let participantCtrl: ConvectorControllerClient<ParticipantController>;
  const mockIdentity = 'B6:0B:37:7C:DF:D2:7A:08:0B:98:BF:52:A4:2C:DC:4E:CC:70:91:E1';
  
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
  });
  
  it('should create a participant', async () => {
    const id = 'my_username';
    await participantCtrl.register(id, 'Test Participant');
  
    const justSavedModel = await adapter.getById<Participant>(id);
  
    expect(justSavedModel.id).to.exist;
  });

  it('should not be able to create a second participant for the same user', async () => {
    const id = 'my_second_username';
    await expect(participantCtrl.register(id, 'Test Participant2')).to.be.eventually
      .rejectedWith(Error);
  });

  it('should not be able to create a participant with the same id', async () => {
    // Fake another certificate
    (adapter.stub as any).usercert = fakeSecondParticipantCert;

    const id = 'my_username';
    await expect(participantCtrl.register(id, 'Test Another Participant')).to.be.eventually
      .rejectedWith(Error);
  });

  it('should be able to create a participant for the new user', async () => {
    const id = 'second_username';
    await participantCtrl.register(id, 'User 2');
  
    const justSavedModel = await adapter.getById<Participant>(id);
  
    expect(justSavedModel.id).to.exist;
  });

  it('should return a participant', async () => {
    const id = 'my_username';
    await expect(participantCtrl.get(id)).to.not.be.eventually.rejectedWith(Error);
  });

  it('should not return a participant', async () => {
    const id = 'non_existing_username';
    await expect(participantCtrl.get(id)).to.be.eventually.rejectedWith(Error);
  });

  it('should not be able to change identity', async () => {
    const id = 'my_username';
    const fake_cert = 'FakeCertificate';
    await expect(participantCtrl.changeIdentity(id, fake_cert)).to.be.eventually.rejectedWith(Error);
  });
});