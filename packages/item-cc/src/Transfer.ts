export class Transfer {
  from: string;
  to: string;
  finished: boolean;
  accepted: boolean;
  createdTimestamp: Date;
  finishedTimestamp: Date;

  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
    this.finished = false;
    this.createdTimestamp = new Date();
  }
}
