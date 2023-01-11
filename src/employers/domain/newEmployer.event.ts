import {EmployerCredentials} from "./employerCredentials";
import {DomainEvent} from "../../core/domainEvent";

export interface NewEmployerEventData {
    id: string
    credentials: EmployerCredentials
}

export class NewEmployerEvent implements DomainEvent<NewEmployerEventData> {
    public readonly name = 'NewEmployerEvent';
    public readonly component = 'Employer';
    constructor(
        public readonly data: NewEmployerEventData
    ) {}
}