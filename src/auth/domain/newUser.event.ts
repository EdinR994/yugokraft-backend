import {DomainEvent} from "../../core/domainEvent";

export interface NewUserEventData<T> {
    id: string,
    role: string,
    recipient: string
    data: T
}

export class NewUserEvent<T> implements DomainEvent<NewUserEventData<T>> {
    public readonly name = 'NewUserEvent'
    public readonly component = 'Authentication'
    constructor(
        public readonly data: NewUserEventData<T>
    ) {}
}