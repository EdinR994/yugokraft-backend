import {Status} from "../../core/status";
import {CandidateCredentials} from "./candidateCredentials";
import {PendingCandidateEntity} from "./pendingCandidate.entity";
import {AvailableCandidateEntity} from "./availableCandidate.entity";

export class CandidateFactory {
    static create(id: string, credentials: CandidateCredentials, status: Status) {
        return status === Status.Open
            ? new PendingCandidateEntity(id, credentials, status)
            : new AvailableCandidateEntity(id, credentials, status)
    }
}