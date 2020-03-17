import * as yup from 'yup';

import {
  BaseStorage,
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { Participant } from './participant.model';
import { ClientIdentity } from 'fabric-shim';

@Controller('participant')
export class ParticipantController extends ConvectorController<ParticipantController> {
  get fullIdentity(): ClientIdentity {
    const stub = (BaseStorage.current as any).stubHelper;
    return new ClientIdentity(stub.getStub());
  };

  @Invokable()
  public async register(
    @Param(yup.string())
      id: string,
    @Param(yup.string())
      name: string,
  ) {
    // Check if there is not already a participant existing for this certificate
    const userExisting = await Participant.query(Participant, {
      'selector': {
        'identities': {
          '$elemMatch': {
            'fingerprint': this.sender,
            'status': true
          }
        }
      }
    });

    if (userExisting[0] !== undefined) {
      throw new Error('This user already has a participant on the blockchain.' +
        'You can only create one participant for each node');
    }

    // Retrieve to see if exists
    const existing = await Participant.getOne(id);

    if (!existing || !existing.id) {
      let participant = new Participant();
      participant.id = id;
      participant.name = name || id;
      // This is basically the organisation for which a new participant is created
      participant.msp = this.fullIdentity.getMSPID();
      // Create a new identity
      participant.identities = [{
        // this.sender is unique to the user that invoked the transaction
        fingerprint: this.sender,
        // Indicates whether this identity is still active
        status: true
      }];

      await participant.save();
    } else {
      throw new Error('Identity exists already, please call changeIdentity fn for updates');
    }
  }
  
  @Invokable()
  public async changeIdentity(
    @Param(yup.string())
      id: string,
    @Param(yup.string())
      newIdentity: string
  ) {
    // Check permissions
    let isAdmin = this.fullIdentity.getAttributeValue('admin');

    // Retrieve to see if exists
    const existing = await Participant.getOne(id);
    if (!existing || !existing.id) {
      throw new Error('No identity exists with that ID');
    }

    if (!isAdmin) {
      throw new Error('Unauthorized. Requester identity is not an admin');
    }

    // Disable previous identities!
    existing.identities = existing.identities.map(identity => {
      identity.status = false;
      return identity;
    });

    // Set the enrolling identity
    existing.identities.push({
      fingerprint: newIdentity,
      status: true
    });

    await existing.save();
  }

  @Invokable()
  public async get(
    @Param(yup.string())
      id: string
  ) {
    const existing = await Participant.getOne(id);
    if (!existing || !existing.id) {
      throw new Error(`No identity exists with that ID ${id}`);
    }
    return existing;
  }

  // TODO: POSSIBLY REMOVE THIS CODE, IS NOW HERE FOR DEBUGGING
  @Invokable()
  public async getAll() {
    // Simply gets all participants with type 'io.worldsibu.examples.participant'
    // regardless of organisation. Useful for debugging.
    let personIds = await Participant.getAll('circular.economy.participant');
    return personIds;
  }
}
