import * as yup from 'yup';
import {Controller, ConvectorController, Invokable, Param} from '@worldsibu/convector-core';

import {Item} from './item.model';
import {Quality} from './quality'
import {Participant} from 'participant-cc';

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
      materials: string,
  ) {
    // TODO: POSSIBLY BETTER THAT WE CREATE SOME UUID AND RETURN IT RIGHT?
    // ALSO: SHOULD BE CHECK THAT ITEM WITH THIS ID DOES NOT ALREADY EXIST
    let item = new Item(id);

    // TODO: CHECK IF OWNER EXISTS
    item.name = name;
    item.itemOwner = ownerID;

    // TODO: CHECK WHAT HAPPENS WHEN YOU INPUT AN INVALID DATE
    var d: Number = new Date().getUTCMilliseconds()
    item.creationDate = d;

    ItemController.determineQuality(item, quality);

    // TODO: DO SOME TRIMMING OF WHITESPACE HERE
    var a: Array<String> = materials.split(',');
    console.log(a);
    item.materials = a;

    // TODO: IF WE CREATE THE ITEM ID, RETURN IT HERE AFTER SAVING
    await item.save();
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
      item.name = name;
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

  private static determineQuality(item: Item, quality: string) {
    if (quality == 'Good') {
      item.quality = Quality.Good;
    } else if (quality == 'Usable') {
      item.quality = Quality.Usable;
    } else if (quality == 'Bad') {
      item.quality = Quality.Bad;
    } else if (quality == 'Broken') {
      item.quality = Quality.Broken;
    } else {
      throw new Error('Illegal argument given for quality')
    }
  }
}
