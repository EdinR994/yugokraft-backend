import {CandidateWhere} from "../domain/candidateWhere";
import {EmployerCredentialsReadModel} from "./employerCredentialsReadModel";
import {CandidatesReadModel} from "./candidatesReadModel";
import {EmployerCalendarsReadModel} from "./employerCalendarsReadModel";

export interface ReadModelRepository {
    getEmployerCalendarsById(employerId: string): Promise<EmployerCalendarsReadModel>;
    getAllCandidates(where: CandidateWhere): Promise<CandidatesReadModel>;
    getCredentials(employerId: string): Promise<EmployerCredentialsReadModel>;
    getEmployerCalendarsByInterviewToken(token: string, timezone?: string): Promise<any>;
}