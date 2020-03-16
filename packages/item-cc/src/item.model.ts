import * as yup from 'yup';
import {Quality} from './quality';
import {ConvectorModel, Default, ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';

export class Item extends ConvectorModel<Item> {
  @ReadOnly()
  @Required()
  public readonly type = 'io.worldsibu.item';

  @Required()
  @Validate(yup.string())
  public name: string;

  @ReadOnly()
  @Required()
  @Validate(yup.number())
  public created: number;

  @Required()
  @Validate(yup.number())
  public modified: number;

  @Default(Quality.Good)
  @Validate(yup.number())
  public quality: Quality;

  //The name of the owner (Participant) encoded as a string
  @Required()
  @Validate(yup.string())
  public owner: string;
}
