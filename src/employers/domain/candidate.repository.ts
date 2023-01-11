import {CandidateWhere} from "./candidateWhere";
import {Status} from "../../core/status";
import {CandidateEntity} from "./candidateEntity";

export interface CandidateRepository {
    getById(id: string, employerId: string): Promise<CandidateEntity>
    getAll(where: CandidateWhere): Promise<any>;
    updateStatus(id: string, employerId: string, status: Status): Promise<boolean>;
    hireCandidate(candidateId: string): Promise<boolean>;
}