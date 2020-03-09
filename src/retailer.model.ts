import * as yup from 'yup';
import {ConvectorModel, ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';

export class RetailerModel extends ConvectorModel<RetailerModel> {
    @ReadOnly()
    @Required()
    public readonly type = 'io.worldsibu.retailer';

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
}
