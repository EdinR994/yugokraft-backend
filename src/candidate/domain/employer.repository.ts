import {EmployerEntity} from "./employer.entity";

export interface EmployerRepository {
    getRequesterId(token: string): Promise<string>;
    getById(id: string): Promise<EmployerEntity>;
}