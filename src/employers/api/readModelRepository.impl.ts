import {ReadModelRepository} from "./readModelRepository";
import {Inject} from "@nestjs/common";
import {EmployerRepository} from "../domain/employer.repository";
import {CandidateRepository} from "../domain/candidate.repository";
import {CalendarRepository} from "../domain/calendar.repository";
import {CandidateWhere} from "../domain/candidateWhere";
import {EmployerCredentialsReadModel} from "./employerCredentialsReadModel";
import {DomainEvents} from "../../core/domainEvents";
import {SearchEvent} from "../domain/search.event";

export class ReadModelRepositoryImpl implements ReadModelRepository {

    constructor(
        @Inject('EmployerRepository')
        private readonly employerRepository: EmployerRepository,
        @Inject('CandidateRepository')
        private readonly candidateRepository: CandidateRepository,
        @Inject('CalendarRepository')
        private readonly calendarRepository: CalendarRepository,
        @Inject('DomainEvents')
        private readonly events: DomainEvents
    ) {}

    getEmployerCalendarsById(employerId: string) {
        return this.calendarRepository.getAll(employerId);
    }

    getAllCandidates(where: CandidateWhere): Promise<any> {
        this.events.push(new SearchEvent(where));
        return this.candidateRepository.getAll(where);
    }

    getCredentials(employerId: string): Promise<EmployerCredentialsReadModel> {
        return this.employerRepository.getCredentials(employerId);
    }

    getEmployerCalendarsByInterviewToken(token: string, timezone: string): Promise<any> {
        return this.calendarRepository.getCalendarsByToken(token, timezone);
    }

}