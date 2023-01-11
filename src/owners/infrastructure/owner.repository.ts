import {OwnerRepository} from "../domain/owner.repository";
import {InjectKnex} from "nestjs-knex/index";
import Knex from "knex";
import {Injectable} from "@nestjs/common";
import {DuplicateEmailException} from "./duplicateEmailException";
import {RenewalPeriod} from "../domain/renewalPeriod";

@Injectable()
export class SqlOwnerRepository implements OwnerRepository {

    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {}

    async save(email: string): Promise<string> {
        const [duplicate] = await this.knex('owners')
            .where({
                email
            });

        const [duplicateEmployer] = await this.knex('employers')
            .where({
                email
            });

        if(duplicate || duplicateEmployer) {
            throw new DuplicateEmailException();
        }

        const [id, ..._] = await this.knex('owners')
            .insert({
                email
            })
            .returning('id');

        return id;
    }

    updateRenewalPeriod(renewalPeriod: number): Promise<boolean> {
        return this.knex('renewal_days')
            .update('value', renewalPeriod)
            .where('id', 1)
            .then(() => true)
    }

    async getRenewalPeriod(): Promise<RenewalPeriod> {
        const [period, ...etc] = await this.knex('renewal_days')
            .select('value')
            .where('id', 1);

        if(!period) {
            throw new Error("")
        }

        return new RenewalPeriod(period['value'])
    }

}