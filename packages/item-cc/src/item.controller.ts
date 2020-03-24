import * as yup from 'yup';
import {Controller, Default, ConvectorController, Invokable, Param} from '@worldsibu/convector-core';

import {Item} from './item.model';
import {Quality} from './quality'
import {Participant} from 'participant-cc';
import { EventType } from './EventType';
import { Event, CreateEvent, RenameEvent, UpdateEvent, TransferEvent } from './Event';

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

    item.creationDate = new Date().toString();

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

    // TODO: DO SOME TRIMMING OF WHITESPACE HERE
    var a: Array<String> = materials.split(',');
    console.log(a);
    item.materials = a;

    var h : Array<Event> = new Array<Event>();
    h.push(new CreateEvent(item.itemOwner, item.name, item.creationDate))    
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

      var e : Event = new RenameEvent(item.itemOwner, item.name, new Date().toString(), oldName);
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

      var e : Event = new UpdateEvent(item.itemOwner, item.name, new Date().toString(), oldQuality, item.quality);
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

      var e : Event = new TransferEvent(item.itemOwner, item.name, new Date().toString(), oldOwner);
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
    var itemGet : Item = await Item.getOne(id);
    var itemHistoryStrings = itemGet.itemHistory.map(event => event.description);

    return "Item ID: " + itemGet.id + ", Name: " + itemGet.name + ", Owner: " + itemGet.itemOwner + ", Quality: " + itemGet.quality + ", Materials: " + itemGet.materials + ", History: " + itemHistoryStrings;
  }

  @Invokable()
  public async getAll() {
    return await Item.getAll('io.worldsibu.item');
  }

  @Invokable()
  public async getItemHistory(
    @Param(yup.string())
      id: string
  ) {
    return (await Item.getOne(id)).itemHistory;
  }
}
