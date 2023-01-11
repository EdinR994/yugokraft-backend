import {DomainEvent} from "../../core/domainEvent";

export interface InterviewHasEndedEventData {
    candidateId: string,
    employerId: string
}

export class InterviewHasEndedEvent implements DomainEvent<InterviewHasEndedEventData> {
    public readonly name = 'InterviewHasEndedEvent';
    public readonly component = 'Employer';
    constructor(public readonly data: InterviewHasEndedEventData) {}
}