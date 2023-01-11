import {DomainEvent} from "../../core/domainEvent";

export class SearchEvent<T> implements DomainEvent<T> {
    public readonly name = 'SearchEvent';
    public readonly component = 'Employer';
    constructor(
        public readonly data: T
    ) {}
}