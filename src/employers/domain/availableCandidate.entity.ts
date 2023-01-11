import {CandidateEntity} from "./candidateEntity";
import {Status} from "../../core/status";
import {PendingCandidateEntity} from "./pendingCandidate.entity";
import {InvalidStatusException} from "./invalidStatusException";
import {CandidateCredentials} from "./candidateCredentials";

export class AvailableCandidateEntity implements CandidateEntity {

    constructor(
        public readonly id: string,
        private readonly credentials: CandidateCredentials,
        private readonly status: Status = Status.Available
    ) {}

    updateStatus(status: Status): CandidateEntity {
        if(this.status !== Status.Open && status > Status.Open) {
            throw new InvalidStatusException(status);
        }

        if(status === Status.Open) {
            return new PendingCandidateEntity(this.id, this.credentials, status);
        }

        return new AvailableCandidateEntity(this.id, this.credentials, status);
    }

    getCredentials(): CandidateCredentials {
        return this.credentials;
    }

    isInvited(): boolean {
        return this.status === Status.Invited;
    }

    isConfirmed(): boolean {
        return this.status === Status.Confirmed
    }

}