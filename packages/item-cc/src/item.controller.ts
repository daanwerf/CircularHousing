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

function checkQuality(quality) {
  const allowedQualities = ['Good', 'Usable', 'Bad', 'Broken'];

  if (allowedQualities.indexOf(quality) === -1) {
    throw new Error('Illegal argument given for quality.');
  }

  return quality;
}

@Controller('item')
export class ItemController extends ConvectorController {
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

    // TODO: DO SOME TRIMMING OF WHITESPACE HERE
    var a: Array<string> = materials.split(',');
    item.materials = a;

    var h: Array<Event> = new Array<Event>();
    h.push(new CreateEvent(item.itemOwner, item.name, item.quality));
    item.itemHistory = h;

    await item.save();
    return item;
  }

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
    console.log(`${item.itemOwner} changed the name of item ${item.id} to ${item.name}`)
  }

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
    console.log(`${item.itemOwner} changed the quality of item ${item.id} to ${item.quality}`)
  }

  @Invokable()
  public async get(
    @Param(yup.string())
      id: string
  ) {
    await ItemController.isParticipant(id);

    return await Item.getOne(id);
  }

  @Invokable()
  public async getAll() {
    return await Item.getAll('io.worldsibu.item');
  }

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
    console.log(`$Participant ${item.itemOwner} proposed a transfer of ownership of item ${item.name} to participant ${item.proposedOwner}`);
  }

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

  private static async checkValidItem(item: Item) {
    if (!item || !item.id) {
      throw new Error('Given item does not currently exist on the ledger')
    }
    return true;
  }

  private static async isTransporter(participantId: string) {
    return ItemController.isType(participantId, 'transporter');
  }

  private static async isParticipant(participantId: string) {
    return ItemController.isType(participantId, 'participant');
  }

  private static async isType(participantId: string, type: string) {
    const participant = await Participant.getOne(participantId);
    if (participant.type !== type) {
      throw new Error(`Given participant is not a ${type}, and therefore is not allowed to perform this action.`)
    }

    return true;
  }
}
