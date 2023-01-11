import {EmployerFilter} from "./employerFilter";
import {EmployerEntity} from "./employer.entity";

export interface EmployerRepository {
    updateActiveStatus(employerId: string, status: boolean): Promise<boolean>;
    getAll(employerFilter: EmployerFilter): Promise<any>;
    getById(id: string): Promise<EmployerEntity>;
}