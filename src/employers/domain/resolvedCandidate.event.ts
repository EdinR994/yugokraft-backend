import {DomainEvent} from "../../core/domainEvent";
import {CandidateEntity} from "./candidateEntity";
import {Status} from "../../core/status";
import {EmployerCredentials} from "./employerCredentials";

export interface ResolvedCandidateEventData {
    candidate: CandidateEntity,
    resolvedStatus: Status,
    credentials: Array<EmployerCredentials>
}

export class ResolvedCandidateEvent implements DomainEvent<ResolvedCandidateEventData> {
    public readonly name = 'ResolvedCandidateEvent';
    public readonly component = 'Employer';
    constructor(
        public readonly data: ResolvedCandidateEventData
    ) {}
}