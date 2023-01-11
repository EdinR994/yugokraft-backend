import {CandidateFilter} from "./candidateFilter";

export interface CandidateRepository {
    getAll(candidateFilter: CandidateFilter);
}