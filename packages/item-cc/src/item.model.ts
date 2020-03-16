import * as yup from 'yup';
import {ConvectorModel, Default, ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';

export class Item extends ConvectorModel<Item> {
  @ReadOnly()
  @Required()
  public readonly type = 'io.worldsibu.item';

  @Required()
  @Validate(yup.string())
  public name: string;

  // Refers to the ID as a string of the participant that is the owner of the item
  @Required()
  @Validate(yup.string())
  public itemOwner: string;

  // The date the Item was created on
  @Required()
  @Validate(yup.number())
  public creationDate: Number;

  // An enum to indicate the current quality of the item
  @Required()
  @Validate(yup.enum())
  public quality: Quality;

  // A list of strings describing the materials of which the item constists
  @Required()
  @Validate(yup.array())
  public materials: Array<String>;
}
