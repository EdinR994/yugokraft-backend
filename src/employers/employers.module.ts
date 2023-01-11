    import { Module } from '@nestjs/common';
import {EmployerController} from "./api/employer.controller";
import {EmployerServiceImpl} from "./domain/employer.service.impl";
import {SqlEmployerRepository} from "./infrastructure/employer.repository";
import {UUIDV4} from "../../lib/uuid";
import {EmployerEntityFactory} from "./domain/employerEntityFactory";
import {SqlCandidateRepository} from "./infrastructure/candidate.repository";
import {AuthModule} from "../auth/auth.module";
import {DomainEventsImpl} from "../../lib/domainEvents.impl";
import {EmployerEvents} from "./api/employer.events";
import {CalendarEntityFactory} from "./domain/calendarEntityFactory";
import {SqlCalendarRepository} from "./infrastructure/calendar.repository";
import {SqlInterviewRepository} from "./infrastructure/interview.repository";
import {InterviewEntityFactoryImpl} from "./domain/interviewEntityFactory";
import {ReadModelRepositoryImpl} from "./api/readModelRepository.impl";
    import {ClockModule} from "../clock/clock.module";
    import {LoggerModule} from "../logger/logger.module";

@Module({
    imports: [
        AuthModule,
        ClockModule,
        LoggerModule
    ],
    controllers: [EmployerController],
    providers: [
        {
            provide: 'DomainEvents',
            useValue: DomainEventsImpl.getInstance()
        },
        {
            provide: 'EmployerRepository',
            useClass: SqlEmployerRepository
        },
        {
            provide: 'Guid',
            useClass: UUIDV4
        },
        {
            provide: 'EmployerEntityFactory',
            useClass: EmployerEntityFactory
        },
        {
            provide: 'EmployerService',
            useClass: EmployerServiceImpl
        },
        {
            provide: 'CandidateRepository',
            useClass: SqlCandidateRepository
        },
        {
            provide: 'CalendarEntityFactory',
            useClass: CalendarEntityFactory
        },
        {
            provide: 'CalendarRepository',
            useClass: SqlCalendarRepository
        },
        {
            provide: 'InterviewRepository',
            useClass: SqlInterviewRepository
        },
        {
            provide: 'InterviewEntityFactory',
            useClass: InterviewEntityFactoryImpl
        },
        {
            provide: 'ReadModelRepository',
            useClass: ReadModelRepositoryImpl
        },
        EmployerEvents
    ]
})
export class EmployersModule {}
