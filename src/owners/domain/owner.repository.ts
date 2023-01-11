import {RenewalPeriod} from "./renewalPeriod";

export interface OwnerRepository {
    save(email: string): Promise<string>;
    updateRenewalPeriod(renewalPeriod: number): Promise<boolean>;
    getRenewalPeriod(): Promise<RenewalPeriod>;
}