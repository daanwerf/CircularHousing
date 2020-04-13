import * as yup from 'yup';
import {
  ConvectorModel, 
  FlatConvectorModel, 
  ReadOnly, 
  Required, 
  Validate
} from '@worldsibu/convector-core';

export class x509Identities extends ConvectorModel<x509Identities> {
  @ReadOnly()
  public readonly type = 'circular.economy.x509identity';

  @Validate(yup.boolean())
  @Required()
  status: boolean;
  
  @Validate(yup.string())
  @Required()
  fingerprint: string;
}

export class Participant extends ConvectorModel<Participant> {
  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public type;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public name: string;

  @ReadOnly()
  @Validate(yup.string())
  public msp: string;

  @Validate(yup.array(x509Identities.schema()))
  public identities: Array<FlatConvectorModel<x509Identities>>;
}