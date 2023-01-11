import {Module} from "@nestjs/common";
import {ClockService} from "./clock.service";
import {SqlClockRepository} from "./clock.repository.impl";
import {DomainEventsImpl} from "../../lib/domainEvents.impl";

@Module({
    providers: [
        {
            provide: 'DomainEvents',
            useValue: DomainEventsImpl.getInstance()
        },
        {
            provide: 'ClockRepository',
            useClass: SqlClockRepository
        },
        ClockService
    ],
    exports: [
        ClockService
    ]
})
export class ClockModule {}