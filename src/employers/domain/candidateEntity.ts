import {Entity} from "../../core/entity";
import {Status} from "../../core/status";
import {CandidateCredentials} from "./candidateCredentials";

export interface CandidateEntity extends Entity<string> {
    isInvited(): boolean
    isConfirmed(): boolean
    getCredentials(): CandidateCredentials
    updateStatus(status: Status)
}