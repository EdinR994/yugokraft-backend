import {CandidateEntity} from "./candidate.entity";
import {CandidateDocument} from "./candidateDocument";
import {RequestedDocument} from "./requestedDocument";
import {CreateCandidateDto} from "../api/createCandidate.dto";
import {UpdateProfileDto} from "../api/updateProfile.dto";

export interface CandidateRepository {
    updateProfile(candidateDto: UpdateProfileDto): Promise<void>;
    save(candidateDto: CreateCandidateDto): Promise<string>;
    getExpired(period: number): Promise<Array<CandidateEntity>>;
    setExpired(token: string, expired: boolean): Promise<boolean>;
    attachDocuments(candidateId: string, documents: CandidateDocument[]): Promise<boolean>;
    getDocuments(candidateId: string, categoryId: string): Promise<RequestedDocument>;
    getAllDocuments(candidateId: string): Promise<RequestedDocument>;
    getById(candidateId: string): Promise<CandidateEntity>;
    getAgeRange(): Promise<any>;
}
