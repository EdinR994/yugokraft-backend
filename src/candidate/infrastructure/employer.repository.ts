import {EmployerRepository} from "../domain/employer.repository";
import {InjectKnex} from "nestjs-knex/index";
import Knex from "knex";
import {EmployerEntity} from "../domain/employer.entity";
import {TokenDoesntExistException} from "./tokenDoesntExistException";

export class SqlEmployerRepository implements EmployerRepository {

    constructor(
        @InjectKnex() private readonly knex: Knex,
    ) {}

    async getById(id: string): Promise<EmployerEntity> {
        const [employer, ...etc] = await this.knex('employers')
            .select([
                'id',
                'name',
                'email'
            ])
            .where('id', id);

        if(!employer) {
            throw new Error();
        }

        return employer
    }

    async getRequesterId(token: string): Promise<string> {
        const [row, ...etc] = await this.knex('tokens')
            .where({ token })
            .andWhereRaw(this.knex.raw(`data->>'type' = 'request'`))

        if(!row) {
            throw new TokenDoesntExistException();
        }

        return row.data.employerId;
    }

}