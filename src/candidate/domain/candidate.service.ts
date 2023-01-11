import {CreateDocument} from "./createDocument";
import {RequestedDocument} from "./requestedDocument";
import {DocumentRequest} from "./documentRequest";
import {UpdateProfileDto} from "../api/updateProfile.dto";
import {CreateCandidateDto} from "../api/createCandidate.dto";

export interface CandidateService {
    updateProfile(candidateDto: UpdateProfileDto): Promise<void>;
    save(candidateDto: CreateCandidateDto): Promise<string>;
    setExpired(token: string, expired: boolean): Promise<boolean>;
    attachDocuments(candidateId: string, data: CreateDocument[]): Promise<boolean>;
    requestDocuments(candidateId: string, request: DocumentRequest): Promise<boolean>;
    getDocuments(candidateId: string, categoryId: string): Promise<RequestedDocument>;
    getAllDocuments(candidateId: string): Promise<RequestedDocument>;
    uploadDocuments(token: string, data: CreateDocument[]): Promise<boolean>;
    getAgeRange(): Promise<any>;
}
