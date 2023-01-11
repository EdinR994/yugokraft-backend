import {DomainEvent} from "../../core/domainEvent";

export interface ExpiredCandidateEventData {
    token: string
}

export class ExpiredCandidateEvent implements DomainEvent<ExpiredCandidateEventData> {
    public readonly name = 'ExpiredCandidateEvent';
    public readonly component = 'Candidate';
    constructor(public readonly data: ExpiredCandidateEventData) {}
}