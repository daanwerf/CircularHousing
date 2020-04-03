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
    const mockCertificate2 = '-----BEGIN CERTIFICATE-----' +
    'MIICiDCCAi+gAwIBAgIUUw89P4fY2y2ZpqF/sf2tnOuEAWEwCgYIKoZIzj0EAwIw' + 
    'fTELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh' + 
    'biBGcmFuY2lzY28xHjAcBgNVBAoTFUdvdmVybm1lbnQuaHVybGV5LmxhYjEhMB8G' + 
    'A1UEAxMYY2EuR292ZXJubWVudC5odXJsZXkubGFiMB4XDTIwMDQwMTEwMDMwMFoX' +
    'DTIxMDQwMTEwMDgwMFowKjEPMA0GA1UECxMGY2xpZW50MRcwFQYDVQQDEw5jaGFp' +
    'bmNvZGVBZG1pbjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABCVQLqWOIPKTL7TX' +
    '2/K9YDcAQ2LtStfNwHKOwDEmJ7BYdVxNISd16eRFBMrgoqnJ1CZksHcrJs3oGwis' +
    'btMEy8mjgd8wgdwwDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwHQYDVR0O' + 
    'BBYEFIbb2C6NelIrCq0W2ouQhtbEaf3FMCsGA1UdIwQkMCKAIH436+wd9sbxSRpi' +
    'CFJYaZnArBqFq8t7oUYVmYg54QFJMHAGCCoDBAUGBwgBBGR7ImF0dHJzIjp7ImFk' +
    'bWluIjoidHJ1ZSIsImhmLkFmZmlsaWF0aW9uIjoiIiwiaGYuRW5yb2xsbWVudElE' + 
    'IjoiY2hhaW5jb2RlQWRtaW4iLCJoZi5UeXBlIjoiY2xpZW50In19MAoGCCqGSM49' +
    'BAMCA0cAMEQCIBjctclmRmwFrp8aWA30wjCffGqnObarj/P6kfFmKxrCAiBltIGJ' +
    'YvjWd6rVSyzrKstpXiXUym11FBcJb0CtjuMdfg==' +
    '-----END CERTIFICATE-----';
  
  before(async () => {
    // Mocks the blockchain execution environment
    const adapter = new MockControllerAdapter();
    const participantCtrl = ClientFactory(ParticipantController, adapter);

    await adapter.init([
      {
        version: '*',
        controller: 'ParticipantController',
        name: join(__dirname, '..')
      }
    ]);

    // Add a user called 'Test' to the mocked network and a the admin user
  adapter.addUser('Test');
  adapter.addUser('chaincodeAdmin');
  });

  
  
  it('should not be allowed, as only the chaincodeAdmin can create a participant', async () => {
    const id = 'mockID';
    const name = 'mockName';
    const msp = 'mockOrganisation';

    await expect(participantCtrl.$withUser('Test').register(id, name, msp, mockIdentity)).to.be.eventually
      .rejectedWith(Error);
  });

  it('should create a new participant', async () => {
    const id = 'mockID';
    const name = 'mockName';
    const msp = 'mockOrganisation';

    await participantCtrl.$withUser('chaincodeAdmin').register(id, name, msp, mockIdentity);
  
    const justSavedModel = await adapter.getById<Participant>(id);
  
    expect(justSavedModel.id).to.exist;
  });

  it('should not be able to create a second participant for the same user', async () => {
    const id = 'mockID2';
    const name = 'mockName2';
    const msp = 'mockOrganisation';

    await expect(participantCtrl.register(id, name, msp, mockIdentity)).to.be.eventually
      .rejectedWith(Error);
  });

  it('should not be able to create a participant with the same id', async () => {
    // Fake another certificate
    (adapter.stub as any).usercert = mockCertificate2;

    const id = 'mockID';
    const name = 'mockName2';
    const msp = 'mockOrganisation';
    await expect(participantCtrl.$withUser('chaincodeAdmin').register(id, name, msp, mockIdentity2)).to.be.eventually
      .rejectedWith(Error);
  });

  it('should be able to create a participant for the new user', async () => {
    const id = 'mockID2';
    const name = 'mockName2';
    const msp = 'mockOrganisation';
    await participantCtrl.$withUser('chaincodeAdmin').register(id, name, msp, mockIdentity2);
  
    const justSavedModel = await adapter.getById<Participant>(id);
  
    expect(justSavedModel.id).to.exist;
  });

  it('should return a participant', async () => {
    const id = 'mockID';
    await expect(participantCtrl.get(id)).to.not.be.eventually.rejectedWith(Error);
  });

  it('should not return a participant', async () => {
    const id = 'non_existing_username';
    await expect(participantCtrl.get(id)).to.be.eventually.rejectedWith(Error);
  });

  it('should not be able to change identity', async () => {
    const id = 'mockID';
    const fake_cert = 'FakeCertificate';
    await expect(participantCtrl.$withUser('Test').changeIdentity(id, fake_cert)).to.be.eventually.rejectedWith(Error);
  });
});