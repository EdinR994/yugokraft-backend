import {DomainEvent} from "../../core/domainEvent";
import {CandidateEntity} from "./candidate.entity";

export interface RequestDocumentEventData {
    candidate: CandidateEntity,
    employerId: string,
    categories: string[],
    requestId: string,
    note: string
}

export class RequestDocumentEvent implements DomainEvent<RequestDocumentEventData> {
    public readonly name = 'RequestDocumentEvent';
    public readonly component = 'Candidate';
    constructor(
        public readonly data: RequestDocumentEventData
    ) {}
}