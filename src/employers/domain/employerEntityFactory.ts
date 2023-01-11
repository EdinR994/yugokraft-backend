import {EntityFactory} from "../../core/entityFactory";
import {EmployerCredentials} from "./employerCredentials";
import {EmployerAggregate} from "./employer.entity";
import {Guid} from "../../core/guid";
import {Inject} from "@nestjs/common";
import {DomainEvents} from "../../core/domainEvents";

export class EmployerEntityFactory implements EntityFactory<EmployerCredentials, string, EmployerAggregate> {

    constructor(
        @Inject('Guid')
        private readonly guid: Guid,
        @Inject('DomainEvents')
        private readonly events: DomainEvents
    ) {}

    from(input: EmployerCredentials): EmployerAggregate {
        return new EmployerAggregate(this.guid.next(), input);
    }

}