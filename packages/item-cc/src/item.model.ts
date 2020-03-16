import * as yup from 'yup';
import {ConvectorModel, Default, ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';

export class Item extends ConvectorModel<Item> {
  @ReadOnly()
  @Required()
  public readonly type = 'io.worldsibu.item';

  @Required()
  @Validate(yup.string())
  public name: string;

  //Refers to the ID as a string of the participant that is the owner of the item
  @Required()
  @Validate(yup.string())
  public itemOwner: string;
}
