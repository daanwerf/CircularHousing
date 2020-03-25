import * as yup from 'yup';
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
  Event,
  CreateEvent,
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
      id: string,
    @Param(yup.string())
      name: string,
    @Param(yup.string())
      ownerID: string,
    @Param(yup.string())
      quality: string,
    @Param(yup.string())
      materials: string
  ) {
    // TODO: POSSIBLY BETTER THAT WE CREATE SOME UUID AND RETURN IT RIGHT?
    // ALSO: SHOULD BE CHECK THAT ITEM WITH THIS ID DOES NOT ALREADY EXIST
    let item = new Item(id);

    // TODO: CHECK IF OWNER EXISTS
    item.name = name;
    item.itemOwner = ownerID;

    item.creationDate = new Date().getTime();
    item.quality = checkQuality(quality);

    // TODO: DO SOME TRIMMING OF WHITESPACE HERE
    var a: Array<string> = materials.split(',');
    console.log(a);
    item.materials = a;

    var h : Array<Event> = new Array<Event>();
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
    let item = await Item.getOne(id)
    if (!item || !item.id) {
      throw new Error('Given item does not currently exist on the ledger')
    }

    const owner = await Participant.getOne(item.itemOwner);
    if (!owner || !owner.id || !owner.identities) {
      throw new Error('Given participant does not currently exist on the ledger')
    }

    const currentOwnerIdentity = owner.identities.filter(identity => identity.status === true)[0];
    if (currentOwnerIdentity.fingerprint === this.sender) {
      var oldName = item.name;
      item.name = name;

      var e : Event = new RenameEvent(item.itemOwner, item.name, oldName);
      item.itemHistory.push(e);

      await item.save();
      console.log('${owner.name} has changed the name of item ${item.id} to ${item.name}')
    } else {
      // TODO: THIS IS PRINTED LITERALLY, NO VARIABLES ARE PRINTED
      throw new Error('${this.sender} is not allowed to edit this item, only ${owner.name} is allowed to')
    }
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

    ItemController.determineQuality(item, quality);
    await item.save();
    console.log('${owner.name} has changed the quality of item ${item.id} to ${item.quality}')
  }

  @Invokable()
  public async get(
    @Param(yup.string())
      id: string
  ) {
    return await Item.getOne(id);
  }

  @Invokable()
  public async getAll() {
    return await Item.getAll('io.worldsibu.item');
  }

  //TODO needs spec test
  @Invokable()
  public async proposeTransfer(
    @Param(yup.string())
      itemId: string,
    @Param(yup.string())
      transferTarget: string,
  ) {

    //first check if item exists
    let item = await Item.getOne(itemId);
    await ItemController.checkValidItem(item);
    await ItemController.checkValidOwner(this.sender, item.itemOwner);

    //then check if the target is legit
    const newOwner = await Participant.getOne(transferTarget);
    if (!newOwner || !newOwner.identities) {
      throw new Error('Given participant as transfer target does not currently exist on the ledger');
    }

    //handle the proposal
    item.proposedOwner = transferTarget;
    item.transfers.push(new Transfer(item.itemOwner, transferTarget));
    await item.save();
    console.log(`$Participant ${item.itemOwner} proposed a transfer of ownership of item ${item.name} to participant ${item.itemOwner}`);
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
    await ItemController.checkValidItem(item);
    await ItemController.checkValidOwner(this.sender, item.proposedOwner);

    const transfer = item.transfers.pop();
    transfer.finishedTimestamp = new Date();
    transfer.finished = true;
    transfer.accepted = accept;

    //If the proposal is accepted, change the item owner
    if (accept) {
      item.itemOwner = item.proposedOwner;
    }
    item.proposedOwner = null;
    item.transfers.push(transfer);

    await item.save();
  }

  private static async checkValidOwner(sender: string, itemOwner: string) {
    const owner = await Participant.getOne(itemOwner);
    if (!owner || !owner.identities) {
      throw new Error('Given participant as owner does not currently exist on the ledger');
    }

    const currentOwnerIdentity = owner.identities.filter(identity => identity.status === true)[0];
    //then check if the item is truly yours to be transferred
    if (currentOwnerIdentity.fingerprint !== sender) {
      throw new Error(`${sender} is not allowed to do this action, only ${owner.name} is allowed to`);
    }
    return true;
  }

  private static async checkValidItem(item: Item) {
    if (!item || item.id) {
      throw new Error('Given item does not currently exist on the ledger')
    }
    return true;
  }

    const currentOwnerIdentity = owner.identities.filter(identity => identity.status === true)[0];
    if (currentOwnerIdentity.fingerprint === this.sender) {
      var oldQuality = item.quality;
      item.quality = checkQuality(quality);

      var e : Event = new UpdateEvent(item.itemOwner, item.name, oldQuality, item.quality);
      item.itemHistory.push(e);

      await item.save();
      console.log('${owner.name} has changed the quality of item ${item.id} to ${item.quality}')
    } else {
      throw new Error('${this.sender} is not allowed to edit this item, only ${owner.name} is allowed to')
    }
  }
}
