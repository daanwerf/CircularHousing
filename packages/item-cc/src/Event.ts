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

export class CreateEvent extends Event {
    constructor(inputOwnerId: string, inputItemName: string, quality : string) {
        super(inputOwnerId, inputItemName, 'CREATE');

        this.description = {
            'quality' : quality
        };
    }
}

export class RenameEvent extends Event {
    constructor(inputOwnerId: string, inputItemName: string, inputOldName: string) {
        super(inputOwnerId, inputItemName, 'RENAME');

        this.description = {
            'oldName': inputOldName
        };
    }
}

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

export class TransferEvent extends Event {
    constructor(inputOwnerId: string, inputItemName: string, inputOldOwner: string) {
        super(inputOwnerId, inputItemName, 'TRANSFER');

        this.description = {
            'oldOwner': inputOldOwner
        };
    }
}