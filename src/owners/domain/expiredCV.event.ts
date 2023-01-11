import {DomainEvent} from "../../core/domainEvent";
import {RenewalPeriod} from "./renewalPeriod";

export interface ExpiredCVEventData {
    period: RenewalPeriod
}

export class ExpiredCVEvent implements DomainEvent<ExpiredCVEventData> {
    public readonly name = 'ExpiredCVEvent';
    public readonly component = 'Owner';
    constructor(
        public readonly data: ExpiredCVEventData
    ) {}
}