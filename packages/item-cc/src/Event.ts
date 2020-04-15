/*
    This file contains Event classes used for the item history. The item history consists
    of a list of Events that are defined here. All Event classes here extends from the Event class,
    that has a number of fields that are shared between Events. The description is the only field
    that differs between Event classes.
*/
export class Event {
    ownerId: string;
    itemName: string;
    date: number;
    type : string;
    description: any;

    constructor(inputOwnerId: string, inputItemName: string, inputType : string) {
        this.ownerId = inputOwnerId;
        this.itemName = inputItemName;
        this.date = new Date().getTime();
        this.type = inputType;
    }
}

/*
    Event for creating an item. Has description object with quality field.
*/
export class CreateEvent extends Event {
    constructor(inputOwnerId: string, inputItemName: string, quality : string) {
        super(inputOwnerId, inputItemName, 'CREATE');

        this.description = {
            'quality' : quality
        };
    }
}

/*
    Event for renaming an item. Has description object with oldName field.
*/
export class RenameEvent extends Event {
    constructor(inputOwnerId: string, inputItemName: string, inputOldName: string) {
        super(inputOwnerId, inputItemName, 'RENAME');

        this.description = {
            'oldName': inputOldName
        };
    }
}

/*
    Event for updating quality of an item. Stores oldQuality and newQuality in the description 
    object.
*/
export class UpdateEvent extends Event {
    constructor(inputOwnerId: string, inputItemName: string, inputOldQuality: string, 
                inputNewQuality: string) {
        super(inputOwnerId, inputItemName, 'UPDATE');

        this.description = {
            'oldQuality': inputOldQuality,
            'newQuality': inputNewQuality
        };
    }
}

/*
    Event for transferring an item. Stores the oldowner. 
*/
export class TransferEvent extends Event {
    constructor(inputOwnerId: string, inputItemName: string, inputOldOwner: string) {
        super(inputOwnerId, inputItemName, 'TRANSFER');

        this.description = {
            'oldOwner': inputOldOwner
        };
    }
}