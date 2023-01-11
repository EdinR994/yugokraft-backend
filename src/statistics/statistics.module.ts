import {Module} from "@nestjs/common";
import {SqlStatisticsRepository} from "./infrastructure/statistics.repository";
import {StatisticsEvents} from "./api/statistics.events";
import {DomainEventsImpl} from "../../lib/domainEvents.impl";
import {StatisticsController} from "./api/statistcs.controller";
import {AuthModule} from "../auth/auth.module";
import {LoggerModule} from "../logger/logger.module";

@Module({
    imports: [
        AuthModule,
        LoggerModule
    ],
    controllers: [
        StatisticsController
    ],
    providers: [
        {
            provide: 'StatisticsRepository',
            useClass: SqlStatisticsRepository
        },
        {
            provide: 'DomainEvents',
            useValue: DomainEventsImpl.getInstance()
        },
        StatisticsEvents
    ]
})
export class StatisticsModule {}