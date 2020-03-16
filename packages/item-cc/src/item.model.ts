import * as yup from 'yup';
import {ConvectorModel, Default, ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';

export class Item extends ConvectorModel<Item> {
  @ReadOnly()
  @Required()
  public readonly type = 'io.worldsibu.item';

  @Required()
  @Validate(yup.string())
  public name: string;

  //The name of the owner (Participant) encoded as a string
  @Required()
  @Validate(yup.string())
  public owner: string;
}
