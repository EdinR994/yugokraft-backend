import {Module} from "@nestjs/common";
import {OwnerController} from "./api/owner.controller";
import {OwnerServiceImpl} from "./domain/owner.service.impl";
import {SqlOwnerRepository} from "./infrastructure/owner.repository";
import {SqlEmployerRepository} from "./infrastructure/employer.repository";
import {AuthModule} from "../auth/auth.module";
import {DomainEventsImpl} from "../../lib/domainEvents.impl";
import {SqlCandidateRepository} from "./infrastructure/candidate.repository";
import {OwnerEvents} from "./api/owner.events";
import {ClockModule} from "../clock/clock.module";
import {LoggerModule} from "../logger/logger.module";

@Module({
    imports: [
        AuthModule,
        ClockModule,
        LoggerModule
    ],
    controllers: [
        OwnerController
    ],
    providers: [
        {
            provide: 'OwnerService',
            useClass: OwnerServiceImpl
        },
        {
            provide: 'OwnerRepository',
            useClass: SqlOwnerRepository
        },
        {
            provide: 'EmployerRepository',
            useClass: SqlEmployerRepository
        },
        {
            provide: 'DomainEvents',
            useValue: DomainEventsImpl.getInstance()
        },
        {
            provide: 'CandidateRepository',
            useClass: SqlCandidateRepository
        },
        OwnerEvents
    ]
})
export class OwnerModule {

}