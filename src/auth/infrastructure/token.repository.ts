import {TokenRepository} from "../domain/token.repository";
import {InjectKnex} from "nestjs-knex/index";
import Knex from "knex";
import {createHash, randomBytes} from 'crypto'
import {TokenEntity} from "../domain/tokenEntity";
import {TokenDoesntExistException} from "./tokenDoesntExist.exception";
import {Injectable, Scope} from "@nestjs/common";

@Injectable()
export class SqlTokenRepository implements TokenRepository {

    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {}

    async delete<T>(token: string): Promise<void> {
        await this.knex('tokens')
            .delete()
            .where({ token });
    }

    async getByToken<T>(tokenToFind: string): Promise<TokenEntity<T>> {
        const [token, ...etc] = await this.knex('tokens')
            .where('token', tokenToFind);

        if(!token) {
            throw new TokenDoesntExistException();
        }

        const entity = new TokenEntity<T>(
            token.token,
            token.data,
            Number(process.env.SESSION_TIMEOUT),
            token['updated_at']
        );

        try {
            entity.tryCheckIfTokenIsExpired();
            return entity;
        } catch (e) {
            await this.knex('tokens')
                .delete()
                .where('token', token.token);
            throw e;
        }
    }

    async createToken<T>(data: T): Promise<string> {
        const salt = randomBytes(16);
        const hash = createHash('sha512')
            .update(salt)
            .digest('hex');
        await this.knex('tokens')
            .insert({ token: hash, data });
        return hash;
    }

    async touch(token: string): Promise<boolean> {
        await this.knex('tokens')
            .update('updated_at', new Date())
            .where('token', token);
        return true;
    }

}