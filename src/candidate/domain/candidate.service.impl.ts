import {CandidateService} from "./candidate.service";
import {CandidateDocument} from "./candidateDocument";
import {CreateDocument} from "./createDocument";
import {Inject} from "@nestjs/common";
import {CandidateRepository} from "./candidate.repository";
import {RequestedDocument} from "./requestedDocument";
import {DocumentRequest} from "./documentRequest";
import {DomainEvents} from "../../core/domainEvents";
import {RequestDocumentEvent} from "./requestDocument.event";
import {DocumentRepository} from "./document.repository";
import {EmployerRepository} from "./employer.repository";
import {UploadDocumentsEvent} from "./uploadDocuments.event";
import {TokenRepository} from "./token.repository";
import {UpdateProfileDto} from "../api/updateProfile.dto";
import {CreateCandidateDto} from "../api/createCandidate.dto";

export class CandidateServiceImpl implements CandidateService {

    constructor(
        @Inject('DomainCandidateRepository')
        private readonly candidateRepository: CandidateRepository,
        @Inject('DomainEvents')
        private readonly events: DomainEvents,
        @Inject('DomainDocumentRepository')
        private readonly documentRepository: DocumentRepository,
        @Inject('EmployerRepository')
        private readonly employerRepository: EmployerRepository,
        @Inject('CandidateTokenRepository')
        private readonly tokenRepository: TokenRepository
    ) {
    }

    updateProfile(candidateDto: UpdateProfileDto): Promise<void> {
        this.prepareData(candidateDto, 'languages', 'language');
        this.prepareData(candidateDto, 'educations', 'degree');
        this.prepareData(candidateDto, 'desiredSpheres');
        this.prepareData(candidateDto, 'skills', 'name');

        return this.candidateRepository.updateProfile(candidateDto);
    }
    save(candidateDto: CreateCandidateDto): Promise<string> {
        return this.candidateRepository.save(candidateDto);
    }

    setExpired(token: string, expired: boolean): Promise<boolean> {
        return this.candidateRepository.setExpired(token, expired);
    }

    async attachDocuments(candidateId: string, data: CreateDocument[]): Promise<boolean> {
        const documents = data.map(CandidateDocument.fabricMethod);
        return this.candidateRepository.attachDocuments(candidateId, documents);
    }

    getDocuments(candidateId: string, categoryId: string): Promise<RequestedDocument> {
        return this.candidateRepository.getDocuments(candidateId, categoryId);
    }

    getAllDocuments(candidateId: string): Promise<RequestedDocument> {
        return this.candidateRepository.getAllDocuments(candidateId);
    }

    async requestDocuments(candidateId: string, request: DocumentRequest): Promise<boolean> {
        const candidate = await this.candidateRepository.getById(candidateId);
        const requestId = await this.documentRepository.saveRequest(candidate.id, request.employerId);
        const categories = await this.documentRepository.getCategoriesInIdList(request.categoryIdList);
        this.events.push(new RequestDocumentEvent({ candidate, categories, employerId: request.employerId, requestId, note: request.note }));
        return true;
    }

    async uploadDocuments(token: string, data: CreateDocument[]): Promise<boolean> {
        const { id: candidateId, employerId, requestId } = await this.tokenRepository.getData(token, "request");
        const candidate = await this.candidateRepository.getById(candidateId);
        const employer = await this.employerRepository.getById(employerId);
        const documents = data.map(CandidateDocument.fabricMethod);
        await this.candidateRepository.attachDocuments(candidateId, documents);
        await this.documentRepository.fulfillRequest(requestId);
        this.events.push(new UploadDocumentsEvent({ candidate, employer }));
        return true;
    }

    private prepareData(candidateDto: UpdateProfileDto, fieldToPrepare: string, fieldToCheck?: string) {
        if (candidateDto[fieldToPrepare] && candidateDto[fieldToPrepare].length > 0) {
            if (fieldToCheck) {
                candidateDto[fieldToPrepare] = candidateDto[fieldToPrepare].filter(DTO => DTO[fieldToCheck]);
            } else {
                candidateDto[fieldToPrepare] = candidateDto[fieldToPrepare].filter(DTO => DTO);
            }
        }
    }

    async getAgeRange(): Promise<any> {
        return await this.candidateRepository.getAgeRange();
    }
}
