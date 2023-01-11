import {EmployerAggregate} from "./employer.entity";
import {EmployerCredentials} from "./employerCredentials";

export interface EmployerRepository {
    save(entity: EmployerAggregate): Promise<boolean>;
    getById(employerId: string): Promise<EmployerAggregate>;
    getCredentials(employerId: string): Promise<EmployerCredentials>;
    getEmployerListWhereCandidateIsPendingOrHavingInterview(employerId: string, candidateId: string): Promise<Array<EmployerCredentials>>;
}