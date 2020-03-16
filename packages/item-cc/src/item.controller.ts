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
    let item = new Item(id);

    item.name = name;
    item.itemOwner = ownerID;
    
    var d : Number = new Date().getDate()
    item.creationDate = d;

    if (quality == 'Good') {
      item.quality = Quality.Good;
    } else if (quality == 'Usable') {
        item.quality = Quality.Usable;
    } else if (quality == 'Bad') {
        item.quality == Quality.Bad;
    } else if (quality == 'Broken') {
        item.quality = Quality.Broken;
    } else {
        throw new Error('Illegal argument given for quality')
    }

    var a : Array<String> = materials.split(',');
    console.log(a)
    item.materials = a;

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
    if(!owner || !owner.id || !owner.identities) {
      throw new Error('Given participant does not currently exist on the ledger')
    }

    const currentOwnerIdentity = owner.identities.filter(identity => identity.status === true)[0];
    if (currentOwnerIdentity.fingerprint === this.sender) {
      item.name = name;
      await item.save();
      console.log('${owner.name} has changed the name of item ${item.id} to ${item.name}')
    } else {
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
    if(!owner || !owner.id || !owner.identities) {
      throw new Error('Given participant as owner does not currently exist on the ledger')
    }

    const currentOwnerIdentity = owner.identities.filter(identity => identity.status === true)[0];
    if (currentOwnerIdentity.fingerprint === this.sender) {
      if (quality == 'Good') {
        item.quality = Quality.Good;
      } else if (quality == 'Usable') {
          item.quality = Quality.Usable;
      } else if (quality == 'Bad') {
          item.quality == Quality.Bad;
      } else if (quality == 'Broken') {
          item.quality = Quality.Broken;
      } else {
          throw new Error('Illegal argument given for quality')
      }
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
    let item = await Item.getOne(id)
    if (!item || !item.id) {
      throw new Error('Given item does not currently exist on the ledger')
    }

    const owner = await Participant.getOne(item.itemOwner);
    if(!owner || !owner.id || !owner.identities) {
      throw new Error('Given participant as owner does not currently exist on the ledger')
    }

    const currentOwnerIdentity = owner.identities.filter(identity => identity.status === true)[0];
    if (currentOwnerIdentity.fingerprint === this.sender) {
      const oldOwner = item.itemOwner;
      item.itemOwner = newOwner;
      await item.save();
      console.log('$Participant ${oldOwner} has transferred ownership of item ${item.name} to participant ${item.itemOwner}')
    } else {
      throw new Error('${this.sender} is not allowed to transfer this item, only ${owner.name} is allowed to')
    }
  }

  @Invokable()
  public async get(
    @Param(yup.string())
      id: string
  ) {
    return await Item.getOne(id);
  }

}
