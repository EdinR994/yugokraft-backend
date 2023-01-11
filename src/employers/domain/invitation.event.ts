import {DomainEvent} from "../../core/domainEvent";
import {CandidateCredentials} from "./candidateCredentials";
import {InterviewEntity} from "./interview.entity";

interface InvitationEventData {
    credentials: CandidateCredentials,
    interview: InterviewEntity
}

export class InvitationEvent implements DomainEvent<InvitationEventData> {
    public readonly name = 'InvitationEvent';
    public readonly component = 'Employer';
    constructor(
        public readonly data: InvitationEventData
    ) {}
}