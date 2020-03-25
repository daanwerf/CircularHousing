import * as yup from 'yup';
import {
  ConvectorModel, 
  Default, 
  ReadOnly, 
  Required, 
  Validate
} from '@worldsibu/convector-core-model';
import { Event } from './Event';

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
  @Validate(yup.string())
  public creationDate: number;

  // An enum to indicate the current quality of the item
  @Required()
  @Validate(yup.string())
  public quality: string;

  // A list of strings describing the materials of which the item constists
  @Required()
  @Validate(yup.array())
  public materials: Array<string>;

  // List of events related to the item
  @Required()
  @Validate(yup.array())
  public itemHistory: Array<Event>;
}
