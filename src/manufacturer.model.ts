import * as yup from 'yup';
import {ConvectorModel, ReadOnly, Required, Validate} from '@worldsibu/convector-core-model';

export class ManufacturerModel extends ConvectorModel<ManufacturerModel> {
    @ReadOnly()
    @Required()
    public readonly type = 'io.worldsibu.manufacturer';

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
