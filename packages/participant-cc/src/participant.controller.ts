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


function checkValidType(type) {
  const allowedTypes = ['participant', 'transporter'];

  if (allowedTypes.indexOf(type) === -1) {
    throw new Error('Illegal argument given for type.');
  }

  return true;
}

@Controller('participant')
export class ParticipantController extends ConvectorController<ParticipantController> {
  get fullIdentity(): ClientIdentity {
    const stub = (BaseStorage.current as any).stubHelper;
    return new ClientIdentity(stub.getStub());
  };

  /*
    This function registers a participant on the blockchain. Only an admin can register a
    participant, which can be seen as a user account on the blockchain. Only when you 
    have this user account, you can participate on the blockchain by creating/updating/
    transfering items.

    The admin registers the participant with the X509 certificate of the corresponding
    node on the network. Only one participant is allowed per certificate. 
  */
  @Invokable()
  public async register(
    @Param(yup.string())
      type: string,
    @Param(yup.string())
      id: string,
    @Param(yup.string())
      name: string,
    @Param(yup.string())
      msp: string,
    @Param(yup.string())
      certificate: string
  ) {
    // Check if the input type is valid
    checkValidType(type);

    // Check if there is not already a participant existing for this certificate,
    // because only one participant per certificate is allowed
    const userExisting = await Participant.query(Participant, {
      'selector': {
        'identities': {
          '$elemMatch': {
            'fingerprint': certificate,
            'status': true
          }
        }
      }
    });

    if (userExisting[0] !== undefined) {
      throw new Error('This user already has a participant on the blockchain.' +
        'You can only create one participant for each node');
    }

    // Check if the invoker is an admin, only an admin can create new participants
    let isAdmin = this.fullIdentity.getAttributeValue('admin');
    if (!isAdmin) {
      throw new Error('Unauthorized. Only admin can create a new participant.');
    }

    // Retrieve to see if exists
    const existing = await Participant.getOne(id);

    if (!existing || !existing.id) {
      let participant = new Participant();
      participant.id = id;
      participant.name = name;
      // This is basically the organisation for which a new participant is created
      participant.msp = msp;
      // Create a new identity
      participant.identities = [{
        // this.sender is unique to the user that invoked the transaction
        fingerprint: certificate,
        // Indicates whether this identity is still active
        status: true
      }];

      participant.type = type;

      await participant.save();
    } else {
      throw new Error('Identity exists already, please call changeIdentity fn for updates');
    }
  }

  /*
    Changes the X509 certficate of a participant. 
    Only the admin (=Government) can do this. 
  */
  @Invokable()
  public async changeIdentity(
    @Param(yup.string())
      id: string,
    @Param(yup.string())
      newIdentity: string
  ) {
    // Check permissions
    let isAdmin = this.fullIdentity.getAttributeValue('admin');
    if (!isAdmin) {
      throw new Error('Unauthorized. Requester identity is not an admin');
    }

    // Retrieve to see if exists
    const existing = await Participant.getOne(id);
    if (!existing || !existing.id) {
      throw new Error('No identity exists with that ID');
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

  /*
    Gets a participant by its id. Throws an error if the participant does not exist.
  */
  @Invokable()
  public async get(
    @Param(yup.string())
      id: string
  ) {
    const existing = await Participant.getOne(id);
    if (!existing || !existing.id) {
      throw new Error('No identity exists with id ' + id);
    }
    return existing;
  }

  /*
    Gets all participants belonging to a certain fingerprint. 
  */
  @Invokable()
  public async getByFingerprint(
    @Param(yup.string())
      fingerprint: string
  ) {
    const userExisting = await Participant.query(Participant, {
      'selector': {
        'identities': {
          '$elemMatch': {
            'fingerprint': fingerprint,
            'status': true
          }
        }
      }
    });

    return userExisting;
  }

  /* 
    Returns all participants 
  */
  @Invokable()
  public async getAll() {
    const participants = await Participant.getAll('participant');
    const transporters = await Participant.getAll('transporter');
    return participants.concat(transporters);
  }
}