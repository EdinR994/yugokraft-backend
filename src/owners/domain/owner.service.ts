import {CandidateFilter} from "./candidateFilter";
import {EmployerFilter} from "./employerFilter";
import {RenewalPeriod} from "./renewalPeriod";

export interface OwnerService {
    createOwner(email: string): Promise<boolean>;
    setActiveStatusForEmployer(employerId: string, active: boolean): Promise<boolean>;
    getAllEmployers(filter: EmployerFilter): Promise<any>;
    getAllCandidates(filter: CandidateFilter): Promise<any>;
    updateRenewalPeriod(renewalPeriod: RenewalPeriod): Promise<boolean>;
    getRenewalPeriod(): Promise<RenewalPeriod>;
}