import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

import {
  Controller,
  Default,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { Item } from './item.model';
import { Participant } from 'participant-cc';
import {
  CreateEvent,
  Event,
  RenameEvent,
  UpdateEvent,
  TransferEvent
} from './Event';

/*
  Function to check if the quality that a client gave as parameter is one
  of the allowed qualities. If not, the function will throw an error. 
*/
function checkQuality(quality) {
  const allowedQualities = ['Good', 'Usable', 'Bad', 'Broken'];

  if (allowedQualities.indexOf(quality) === -1) {
    throw new Error('Illegal argument given for quality.');
  }

  return quality;
}

/*
  Controller for the Item model. This controller handles everything related to items,
  including creating, retrieving, updating and transferring items.
*/
@Controller('item')
export class ItemController extends ConvectorController {

  /*
    Create an item with a name, owner (which should be an existing participant),
    quality (which should be one of the four strings defined above), and materials,
    which should be a comma separated list.
  */
  @Invokable()
  public async create(
    @Param(yup.string())
      name: string,
    @Param(yup.string())
      ownerID: string,
    @Param(yup.string())
      quality: string,
    @Param(yup.string())
      materials: string
  ) {
    await ItemController.isParticipant(ownerID);

    let item = new Item();
    await ItemController.checkValidOwner(this.sender, ownerID);

    // Create a unique UUID for the item
    item.id = uuidv4();

    item.name = name;
    item.itemOwner = ownerID;

    item.creationDate = new Date().getTime();
    item.quality = checkQuality(quality);

    var a: Array<string> = materials.split(',');
    item.materials = a;

    var h: Array<Event> = new Array<Event>();
    h.push(new CreateEvent(item.itemOwner, item.name, item.quality));
    item.itemHistory = h;

    await item.save();
    return item;
  }

  /*
    Function to update the name of an item. Takes as input the id of the item and 
    the new name. 

    Can only be invoked by owner of the item. 
  */
  @Invokable()
  public async updateName(
    @Param(yup.string())
      id: string,
    @Param(yup.string())
      name: string,
  ) {
    let item = await Item.getOne(id);
    await ItemController.checkValidItem(item);
    await ItemController.checkValidOwner(this.sender, item.itemOwner);

    var oldName = item.name;
    item.name = name;

    var e : Event = new RenameEvent(item.itemOwner, item.name, oldName);
    item.itemHistory.push(e);

    await item.save();
  }

  /*
    Function to update the quality of an item. Takes as input the id and the new quality of
    the item.

    Can only be invoked by the owner of the item. Also, the new quality should be one of the
    allowed strings.
  */
  @Invokable()
  public async updateQuality(
    @Param(yup.string())
      id: string,
    @Param(yup.string())
      quality: string,
  ) {
    let item = await Item.getOne(id);
    await ItemController.checkValidItem(item);
    await ItemController.checkValidOwner(this.sender, item.itemOwner);
    checkQuality(quality);
    let oldQuality = item.quality;
    item.quality = quality;

    var e : Event = new UpdateEvent(item.itemOwner, item.name, oldQuality, item.quality);
    item.itemHistory.push(e);

    await item.save();
  }

  /*
    Gets an item.
  */
  @Invokable()
  public async get(
    @Param(yup.string())
      id: string
  ) {
    return await Item.getOne(id);
  }

  /*
    Gets all items.
  */
  @Invokable()
  public async getAll() {
    return await Item.getAll('io.worldsibu.item');
  }

  /*
    Proposes a transfer of an item to a different participant. Takes as input the id of the item
    and the proposed owner. 

    Can only be done by the owner of the item, and if a proposal of this item to any participant
    has already been accepted, a new proposal cannot be made anymore (since the item is 
    already set to transfer to someone). 
  */
  @Invokable()
  public async proposeTransfer(
    @Param(yup.string())
      itemId: string,
    @Param(yup.string())
      transferTarget: string,
  ) {
    //first check if item exists
    let item = await Item.getOne(itemId);
    if (item.proposalAccepted) {
      throw new Error('This proposal has already been accepted, a new owner cannot be proposed anymore');
    }

    await ItemController.checkValidItem(item);
    await ItemController.checkValidOwner(this.sender, item.itemOwner);

    //then check if the target is legit
    await ItemController.isParticipant(transferTarget);
    const newOwner = await Participant.getOne(transferTarget);
    if (!newOwner || !newOwner.identities) {
      throw new Error('Given participant as transfer target does not currently exist on the ledger');
    }

    //handle the proposal
    item.proposedOwner = transferTarget;
    item.proposalAccepted = false;
    await item.save();
  }

  /*
    Answers a proposal with true (=yes) or false (=no). Takes as other input the id of the item.

    If a proposal has already been accepted, this cannot be undone anymore. Proposal can only
    be accepted by the proposedOwner. 
  */
  @Invokable()
  public async answerProposal(
    @Param(yup.string())
      itemId: string,
    @Param(yup.boolean())
      accept: boolean
  ) {
    //first check if item exists
    let item = await Item.getOne(itemId);

    if (item.proposalAccepted) {
      throw new Error('This proposal was already accepted, this cannot be changed anymore.');
    }

    await ItemController.checkValidItem(item);
    await ItemController.checkValidOwner(this.sender, item.proposedOwner);

    //If the proposal is accepted, change the item owner
    if (accept) {
      item.proposalAccepted = true;
    } else {
      item.proposalAccepted = false;
      item.proposedOwner = '';
    }

    await item.save();
  }

  /*
    Function to send item to transporter for transportation. Takes input the id of the item
    and the id of the transporter (which is a participant). 

    Can only be done the owner of the item, and the participant that is meant to transport
    the item should be a transporter. 

    Also, the item can only be sent to a transporter if it has a proposedOwner and the proposal
    has been accepted. 
  */
  @Invokable()
  public async transport(
    @Param(yup.string())
      itemId: string,
    @Param(yup.string())
      transporter: string
  ) {
    await ItemController.isTransporter(transporter);

    let item = await Item.getOne(itemId);
    await ItemController.checkValidItem(item);
    await ItemController.checkValidOwner(this.sender, item.itemOwner);

    if (item.proposedOwner === '') {
      throw new Error('There is no proposed owner to transfer this item to.');
    }

    if (!item.proposalAccepted) {
      throw new Error('Transfer proposal has not been accepted, so item cannot be transported.');
    }

    item.transporter = transporter;

    await item.save();
  }

  /*
    Delivers an item to its new owner. Only takes the item id as input, this is done by the transporter
    that was transporting the item.
  */
  @Invokable()
  public async deliverItem(
    @Param(yup.string())
      itemId: string
  ) {
    //first check if item exists
    let item = await Item.getOne(itemId);
    await ItemController.checkValidItem(item);
    // Check if the transporter is the one delivering it
    await ItemController.checkValidOwner(this.sender, item.transporter);

    item.itemHistory.push(new TransferEvent(item.proposedOwner, item.name, item.itemOwner));
    item.itemOwner = item.proposedOwner;
    item.proposedOwner = '';
    item.proposalAccepted = false;
    item.transporter = '';

    await item.save();
  }

  /*
    Returns all items for a given participant.
  */
  @Invokable()
  public async getParticipantItems(
    @Param(yup.string())
      participantId: string
  ) {
    await ItemController.checkValidOwner(this.sender, participantId);

    return await Item.query(Item, {
      'selector': {
        'itemOwner': participantId,
      }
    });
  }

  /*
    Returns all proposals for a given participant.
  */
  @Invokable()
  public async getParticipantProposals(
    @Param(yup.string())
      participantId: string
  ) {
    await ItemController.checkValidOwner(this.sender, participantId);

    return await Item.query(Item, {
      'selector': {
        'proposedOwner': participantId
      }
    });
  }

  /*
    Returns all items that a given transporter needs to deliver.
  */
  @Invokable()
  public async getTransportItems(
    @Param(yup.string())
      transporterId: string
  ) {
    await ItemController.checkValidOwner(this.sender, transporterId);

    return await Item.query(Item, {
      'selector': {
        'transporter': transporterId
      }
    });
  }

  /*
    Helper function to check if the owner of an item is the same one that as the invoker
    of the function (=sender). 
  */
  private static async checkValidOwner(sender: string, itemOwner: string) {
    const owner = await Participant.getOne(itemOwner);
    if (!owner || !owner.identities) {
      throw new Error('Given participant as owner does not currently exist on the ledger');
    }
    const currentOwnerIdentity = owner.identities.filter(identity => identity.status === true)[0];
    //then check if the item is truly yours to be transferred
    if (currentOwnerIdentity.fingerprint !== sender) {
      throw new Error(`You are not allowed to do this action, only ${owner.name} is allowed to`);
    }
    return true;
  }

  /*
    Helper function to check if an item exists. 
  */
  private static async checkValidItem(item: Item) {
    if (!item || !item.id) {
      throw new Error('Given item does not currently exist on the ledger')
    }
    return true;
  }

  /*
    Helper function to check if a given participant is a transporter.
  */
  private static async isTransporter(participantId: string) {
    return ItemController.isType(participantId, 'transporter');
  }

  /*
    Helper function to check if a given participant is a participant.
  */
  private static async isParticipant(participantId: string) {
    return ItemController.isType(participantId, 'participant');
  }

  /*
    Helper function to check if a given participant is of a given type.
  */
  private static async isType(participantId: string, type: string) {
    const participant = await Participant.getOne(participantId);
    if (participant.type !== type) {
      throw new Error(`Given participant is not a ${type}, and therefore is not allowed to perform this action.`)
    }

    return true;
  }
}
