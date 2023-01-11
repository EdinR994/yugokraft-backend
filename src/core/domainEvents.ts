import {DomainEvent} from "./domainEvent";

export interface DomainEvents {
    push<T>(event: DomainEvent<T>): this
}