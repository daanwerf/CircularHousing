import {ChaincodeTx} from '@worldsibu/convector-platform-fabric';
import {Controller, ConvectorController, Invokable, Param} from '@worldsibu/convector-core';

import {Item} from './item.model';
import {Participant} from "participant-cc";

@Controller('item')
export class ItemController extends ConvectorController<ChaincodeTx> {
  @Invokable()
  public async create(
    @Param(Item)
      item: Item
  ) {
    await item.save();
  }
}
