import {DomainEvent} from "../../core/domainEvent";
import {EmployerEntity} from "./employer.entity";

export interface ActiveStatusUpdateEventData {
    employer: EmployerEntity,
    active: boolean
}

export class ActiveStatusUpdateEvent implements DomainEvent<ActiveStatusUpdateEventData> {
    public readonly name = 'ActiveStatusUpdateEvent';
    constructor(
        public readonly data: ActiveStatusUpdateEventData
    ) {}
}