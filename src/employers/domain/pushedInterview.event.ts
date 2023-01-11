import {DomainEvent} from "../../core/domainEvent";
import {InterviewTime} from "./interviewTime";
import {CandidateCredentials} from "./candidateCredentials";
import {EmployerCredentials} from "./employerCredentials";

export interface PushedInterviewEventData {
    candidateId: string,
    employerId: string,
    candidateCredentials: CandidateCredentials,
    employerCredentials: EmployerCredentials,
    interviewId: string,
    time: InterviewTime,
    offset: number
}

export class PushedInterviewEvent implements DomainEvent<any> {
    public readonly name = 'PushedInterviewEvent';
    public readonly component = 'Employer';
    constructor(
        public readonly data: PushedInterviewEventData
    ) {}
}