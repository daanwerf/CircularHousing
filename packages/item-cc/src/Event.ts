import { EventType } from "./EventType";
import { Quality } from './quality';

export class Event {
    ownerId: String;
    itemName: String;
    date: String;
    description: String;

    constructor(inputOwnerId: String, inputItemName: String, inputDate: String) {
        this.ownerId = inputOwnerId;
        this.itemName = inputItemName;
        this.date = inputDate;
    }
}

export class CreateEvent extends Event {
    constructor(inputOwnerId: String, inputItemName: String, inputDate: String) {
        super(inputOwnerId, inputItemName, inputDate)
        this.description = "{Create, Owner: " + this.ownerId + ", Item name: " + this.itemName + ", date: " + this.date + "}";
    }
}

export class RenameEvent extends Event {
    oldName: String;

    constructor(inputOwnerId: String, inputItemName: String, inputDate: String, inputOldName: String) {
        super(inputOwnerId, inputItemName, inputDate)
        this.oldName = inputOldName;
        this.description = "{Rename, Owner: " + this.ownerId + " Old Item Name: " + this.oldName + ", New Item Name: " + this.itemName + ", date: " + this.date + "}";
    }
}

export class UpdateEvent extends Event {
    oldQuality: Quality;
    newQuality: Quality;

    constructor(inputOwnerId: String, inputItemName: String, inputDate: String, inputOldQuality: Quality, inputNewQuality: Quality) {
        super(inputOwnerId, inputItemName, inputDate)
        this.oldQuality = inputOldQuality;
        this.newQuality = inputNewQuality;
        this.description = "{Update Quality, Owner: " + this.ownerId + ", Item name: " + this.itemName + ", Old Quality: " + this.oldQuality + ", New Quality: " + this.newQuality + ", date: " + this.date + "}";
    }
}

export class TransferEvent extends Event {
    oldOwner: String;

    constructor(inputOwnerId: String, inputItemName: String, inputDate: String, inputOldOwner: String) {
        super(inputOwnerId, inputItemName, inputDate)
        this.oldOwner = inputOldOwner;
        this.description = "{Transfer, New Owner: " + this.ownerId + ", Item Name: " + this.itemName + ", Old Owner: " + this.oldOwner + ", date: " + this.date + "}";
    }
}