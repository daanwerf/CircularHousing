npx lerna add participant-cc --scope item-cc --include-filtered-dependencies
npx lerna bootstrap

import * as yup from yup
import {Controller, ConvectorController, Invokable, Param} from '@worldsibu/convector-core';

import {Item} from './item.model';
import {Participant} from "participant-cc";

@Controller('item')
export class ItemController extends ConvectorController<ChaincodeTx> {
  @Invokable()
  public async create(
    @Param(yup.string())
      id: string,
    @Param(yup.string())
      name: string,
    @Param(yup.string())
      ownerID: string,
    @Param(yup.string())
      creationDate: string,
    @Param(yup.string())
      quality: string,
    @Param(yup.string())
      materials: string,
  ) {
    let item = new Item(id)
    item.name = name
    item.itemOwner = ownerID
    
    item.creationDate = Date.parse(creationDate)

    var q : Quality = Quality[quality]
    item.quality = q

    var a : Array<String> = materials.split(',')
    item.materials = a

    await item.save();
  }




}
