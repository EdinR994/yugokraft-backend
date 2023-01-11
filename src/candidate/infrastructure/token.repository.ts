import {TokenRepository} from "../domain/token.repository";
import {TokenDoesntExistException} from "./tokenDoesntExistException";
import {InjectKnex} from "nestjs-knex/index";
import Knex from "knex";

export class SqlTokenRepository implements TokenRepository {

    constructor(
        @InjectKnex() private readonly knex: Knex,
    ) {}

    async getData<T>(token: string, type?: string): Promise<T> {
        const query = this.knex('tokens')
            .where({ token })

        if(type) {
            query
                .andWhereRaw(this.knex.raw(`data->>'type' = ?::text`, [type]))
        }

        const [row, ...etc] = await query;

        if(!row) {
            throw new TokenDoesntExistException();
        }

        return row.data;
    }
}