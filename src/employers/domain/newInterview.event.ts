import {DomainEvent} from "../../core/domainEvent";
import {InterviewEntity} from "./interview.entity";
import {CandidateCredentials} from "./candidateCredentials";

export interface NewInterviewEventData {
    interview: InterviewEntity;
    candidateCredentials: CandidateCredentials;
    candidateId: string;
    employerId: string;
}

export class NewInterviewEvent implements DomainEvent<NewInterviewEventData> {
    public readonly name = 'NewInterviewEvent';
    public readonly component = 'Employer';
    constructor(
        public readonly data: NewInterviewEventData
    ) {}
}