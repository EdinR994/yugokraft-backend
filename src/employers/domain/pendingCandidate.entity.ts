import {Status} from "../../core/status";
import {InvalidStatusException} from "./invalidStatusException";
import {CandidateEntity} from "./candidateEntity";
import {CandidateCredentials} from "./candidateCredentials";

export class PendingCandidateEntity implements CandidateEntity {

    constructor(
        public readonly id: string,
        private readonly credentials: CandidateCredentials,
        private readonly status: Status
    ) {}

    updateStatus(status: Status): CandidateEntity {
        if(status <= Status.Open) {
            throw new InvalidStatusException(status);
        }
        return new PendingCandidateEntity(this.id, this.credentials, status);
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