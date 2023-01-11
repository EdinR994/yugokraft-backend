import {EmployerService} from "./employer.service";
import {EmployerRepository} from "./employer.repository";
import {EmployerAggregate} from "./employer.entity";
import {EntityFactory} from "../../core/entityFactory";
import {EmployerCredentials} from "./employerCredentials";
import {Inject, Injectable} from "@nestjs/common";
import {CandidateRepository} from "./candidate.repository";
import {DomainEvents} from "../../core/domainEvents";
import {CalendarRepository} from "./calendar.repository";
import {CreateCalendarData} from "./createCalendarData";
import {CalendarEntity} from "./calendar.entity";
import {InterviewEntity} from "./interview.entity";
import {InterviewRepository} from "./interview.repository";
import {NewInterviewEvent} from "./newInterview.event";
import {CreateInterviewData} from "./createInterviewData";
import {AcquireDateForInterviewData} from "./acquireDateForInterviewData";
import {EmptyCalendarListException} from "./emptyCalendarListException";
import {Status} from "../../core/status";
import {NewEmployerEvent} from "./newEmployer.event";
import {PushedInterviewEvent} from "./pushedInterview.event";
import {ResolvedCandidateEvent} from "./resolvedCandidate.event";
import {DeletedCalendarEvent} from "./deletedCalendar.event";

@Injectable()
export class EmployerServiceImpl implements EmployerService {

    constructor(
        @Inject('EmployerRepository')
        private readonly employerRepository: EmployerRepository,
        @Inject('EmployerEntityFactory')
        private readonly employerEntityFactory: EntityFactory<EmployerCredentials, string, EmployerAggregate>,
        @Inject('CalendarEntityFactory')
        private readonly calendarEntityFactory: EntityFactory<CreateCalendarData, string, CalendarEntity>,
        @Inject('InterviewEntityFactory')
        private readonly interviewEntityFactory: EntityFactory<CreateInterviewData, string, InterviewEntity>,
        @Inject('CandidateRepository')
        private readonly candidateRepository: CandidateRepository,
        @Inject('CalendarRepository')
        private readonly calendarRepository: CalendarRepository,
        @Inject('InterviewRepository')
        private readonly interviewRepository: InterviewRepository,
        @Inject('DomainEvents')
        private readonly events: DomainEvents
    ) {}

    async inviteForInterview(employerId: string, candidateId: string): Promise<boolean> {
        const entity = await this.employerRepository.getById(employerId);
        const candidate = await this.candidateRepository.getById(candidateId, employerId);

        if(!entity.getRelevantCalendarLength()) {
            throw new EmptyCalendarListException();
        }

        if(candidate.isInvited() || candidate.isConfirmed()) {
            return true;
        }

        const interview = this.interviewEntityFactory.from({ employerId, candidateId });

        candidate.updateStatus(Status.Invited);

        await this.interviewRepository.save([interview]);
        await this.candidateRepository.updateStatus(candidate.id, employerId, Status.Invited);

        this.events.push(new NewInterviewEvent({
            interview,
            candidateId: candidate.id,
            candidateCredentials: candidate.getCredentials(),
            employerId: entity.id
        }));

        return true;
    }

    async acquireDateForInterview({ token, time, offset = 0 }: AcquireDateForInterviewData) {
        const interviewId = await this.interviewRepository.getInterviewIdByToken(token);
        const interview = await this.interviewRepository.getById(interviewId);
        const entity = await this.employerRepository.getById(interview.employerId);
        const candidate = await this.candidateRepository.getById(interview.candidateId, entity.id);

        const calendar = entity.getCalendarForInterview(time);

        calendar.addInterview(interview, time);
        candidate.updateStatus(Status.Confirmed);

        await this.interviewRepository.acquireDate(calendar.id, interview.id, time);
        await this.candidateRepository.updateStatus(candidate.id, entity.id, Status.Confirmed);
        await this.interviewRepository.deleteInterviewToken(token);

        this.events.push(new PushedInterviewEvent({
            candidateId: candidate.id,
            candidateCredentials: candidate.getCredentials(),
            employerId: entity.id,
            employerCredentials: entity.getCredentials(),
            interviewId: interview.id,
            time,
            offset
        }));

        return true;
    }

    async createEmployer(credentials: EmployerCredentials): Promise<boolean> {
        const entity = this.employerEntityFactory.from(credentials);
        await this.employerRepository.save(entity);
        this.events.push(new NewEmployerEvent({ id: entity.id, credentials }));
        return true;
    }

    async createCalendar(data: CreateCalendarData) {
        const calendar = this.calendarEntityFactory.from(data);
        const entity = await this.employerRepository.getById(data.employerId);
        entity.addCalendar(calendar);
        await this.calendarRepository.save(calendar);
        return true;
    }

    async deleteEmployerCalendar(employerId: string, calendarId: string): Promise<boolean> {
        const entity = await this.employerRepository.getById(employerId);
        const calendar = entity.findCalendarById(calendarId);
        await this.calendarRepository.deleteEmployerCalendar(employerId, calendarId);
        this.events.push(new DeletedCalendarEvent({ attachedInterviews: calendar.getInterviewList() }));
        return true;
    }

    async resolveCandidate(employerId: string, candidateId: string, resolvedStatus: Status) {

        const candidate = await this.candidateRepository.getById(candidateId, employerId);

        const credentials = await this.employerRepository
            .getEmployerListWhereCandidateIsPendingOrHavingInterview(employerId, candidateId);

        candidate.updateStatus(resolvedStatus);

        if(resolvedStatus === Status.Hired) {
            await this.candidateRepository.hireCandidate(candidate.id);
            await this.interviewRepository.deleteInterviews(candidate.id);
        } else {
            await this.candidateRepository.updateStatus(candidate.id, employerId, resolvedStatus);
        }

        this.events.push(new ResolvedCandidateEvent({ candidate, credentials, resolvedStatus }))

        return true;
    }

}