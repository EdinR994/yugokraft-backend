import {DomainEvent} from "../../core/domainEvent";
import {CandidateEntity} from "./candidate.entity";
import {EmployerEntity} from "./employer.entity";

export interface UploadDocumentsEventData {
    candidate: CandidateEntity,
    employer: EmployerEntity
}

export class UploadDocumentsEvent implements DomainEvent<UploadDocumentsEventData> {
    public readonly name = 'UploadDocumentsEvent';
    constructor(
        public readonly data: UploadDocumentsEventData
    ) {}
}