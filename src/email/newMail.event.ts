import {DomainEvent} from "../core/domainEvent";

interface Attachment {
    name: string,
    data: Buffer
}

export interface NewMailEventData<T> {
    data: T,
    attachments?: Attachment[]
    recipient: string | string[],
    type: string
}

export class NewMailEvent<T> implements DomainEvent<NewMailEventData<T>> {
    public readonly name = 'NewMailEvent';
    public readonly component = 'Email';
    constructor(public readonly data: NewMailEventData<T>) {}
}