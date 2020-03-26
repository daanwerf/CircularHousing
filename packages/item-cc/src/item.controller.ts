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
      name: string,
    @Param(yup.string())
      ownerID: string,
    @Param(yup.string())
      quality: string,
    @Param(yup.string())
      materials: string
  ) {
    let item = new Item();

    // TODO: POSSIBLY BETTER THAT WE CREATE SOME UUID AND RETURN IT RIGHT?
    // ALSO: SHOULD BE CHECK THAT ITEM WITH THIS ID DOES NOT ALREADY EXIST
    var id : string = "kaas";
    item.id = uuidv4();

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
    let item = await Item.getOne(id)
    if (!item || !item.id) {
      throw new Error('Given item does not currently exist on the ledger')
    }

    const owner = await Participant.getOne(item.itemOwner);
    if (!owner || !owner.id || !owner.identities) {
      throw new Error('Given participant as owner does not currently exist on the ledger')
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

  @Invokable()
  public async transfer(
    @Param(yup.string())
      id: string,
    @Param(yup.string())
      newOwner: string,
  ) {
    let item = await Item.getOne(id);
    if (!item || !item.id) {
      throw new Error('Given item does not currently exist on the ledger');
    }

    console.log(item.itemOwner);
    const owner = await Participant.getOne(item.itemOwner);
    const allPart = await Participant.getAll('circular.economy.participant');
    console.log(allPart);
    if (!owner || !owner.id || !owner.identities) {
      throw new Error('Given participant as owner does not currently exist on the ledger');
    }

    const currentOwnerIdentity = owner.identities.filter(identity => identity.status === true)[0];
    if (currentOwnerIdentity.fingerprint === this.sender) {
      const oldOwner = item.itemOwner;
      item.itemOwner = newOwner;

      var e : Event = new TransferEvent(item.itemOwner, item.name, oldOwner);
      item.itemHistory.push(e);

      await item.save();
      console.log('$Participant ${oldOwner} has transferred ownership of item ${item.name} to participant ${item.itemOwner}');
    } else {
      throw new Error('${this.sender} is not allowed to transfer this item, only ${owner.name} is allowed to');
    }
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
}
