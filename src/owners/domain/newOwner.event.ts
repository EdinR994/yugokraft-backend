import {DomainEvent} from "../../core/domainEvent";

export interface NewOwnerEventData {
    id: string,
    email: string
}

export class NewOwnerEvent implements DomainEvent<NewOwnerEventData> {
    public readonly name = 'NewOwnerEvent';
    public readonly component = 'Owner';
    constructor(
        public readonly data: NewOwnerEventData
    ) {}
}