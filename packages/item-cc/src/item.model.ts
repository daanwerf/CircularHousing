import * as yup from 'yup';
import { Event } from './Event';
import {
  ConvectorModel, 
  Default, 
  ReadOnly, 
  Required, 
  Validate
} from '@worldsibu/convector-core-model';

export class Item extends ConvectorModel<Item> {
  @ReadOnly()
  @Required()
  public readonly type = 'io.worldsibu.item';

  // Name of an item
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
  @Validate(yup.string())
  public quality: string;

  // proposedOwner of an item to transfer the item to
  @Validate(yup.string())
  public proposedOwner: string;

  // boolean to indicate that a proposal has been accepted
  @Validate(yup.boolean())
  public proposalAccepted: boolean;

  // Transporter to transport an item
  @Validate(yup.string())
  public transporter: string;

  // A list of strings describing the materials of which the item consists
  @Required()
  @Validate(yup.array())
  public materials: Array<string>;

  // List of events related to the item
  @Required()
  @Validate(yup.array())
  public itemHistory: Array<Event>;
}
