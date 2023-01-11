import {AuthRepository} from "../domain/auth.repository";
import {InjectKnex, Knex} from 'nestjs-knex'
import {UserEntity} from "../domain/userEntity";
import {EmployerEntity} from "../domain/employerEntity";
import {AuthCredentials} from "../domain/authCredentials";
import {UserDoesntExistException} from "./userDoesntExist.exception";
import {TokenDoesntExistException} from "./tokenDoesntExist.exception";
import {IPassword} from "../domain/password";
import {HashedPassword} from "../domain/hashedPassword";
import {PlainPassword} from "../domain/plainPassword";
import {TokenEntity} from "../domain/tokenEntity";
import {OwnerEntity} from "../domain/ownerEntity";
import {randomBytes} from "crypto"
import {DomainEvents} from "../../core/domainEvents";
import {Inject, LoggerService} from "@nestjs/common";

export class SqlAuthRepository implements AuthRepository {

    constructor(
        @InjectKnex()
        private readonly knex: Knex,
        @Inject('LoggerService')
        private readonly logger: LoggerService
    ) {}

    private async getOwnerByWhere(where: any): Promise<UserEntity | null> {
        const [user, _] = await this.knex('owners')
            .where(where)
        if (user) {
            this.logger.log(`Trying to find user ${JSON.stringify(user)}`);
        } else {
            this.logger.log(`User not found`);
        }
        if(!user) {
            return user;
        }

        return new OwnerEntity(
            user.id,
            new AuthCredentials(user.email, user.password ? new HashedPassword(user.password) : new PlainPassword('sudo90ok')),
            this.logger
        )
    }

    private async getEmployerWhere(where: any): Promise<UserEntity | null> {
        const [user, _] = await this.knex('employers')
            .where(where)

        if (user) {
            this.logger.log(`Trying to find user ${JSON.stringify(user)}`);
        } else {
            this.logger.log(`User not found`);
        }
        if(!user) {
            return user;
        }

        return new EmployerEntity(
            user.id,
            user.active,
            user.name,
            new AuthCredentials(user.email, user.password ? new HashedPassword(user.password) : new PlainPassword(randomBytes(32).toString('hex'))),
            this.logger
        )
    }

    private async getTokenWhere<T>(where: any): Promise<TokenEntity<T>> {
        const [entity, ...etc] = await this.knex('tokens')
            .where(where);

        if (!entity) {
            throw new TokenDoesntExistException();
        }

        const token = new TokenEntity(
            entity.token,
            entity.data,
            Number(process.env.RESET_PASSWORD_TIMEOUT),
            entity['updated_at']
        );

        try {
            token.tryCheckIfTokenIsExpired();
        } catch (e) {
            await this.knex('tokens')
                .delete()
                .where('token', token)
        }

        return token;
    }


    async getByEmail(email: string): Promise<UserEntity> {
        const user = (await this.getEmployerWhere({ email }) || await this.getOwnerByWhere({ email }));

        if(!user) {
            throw new UserDoesntExistException();
        }

        return user;
    }

    async getById(id: string): Promise<UserEntity> {
        const user = (await this.getEmployerWhere({ id }) || await this.getOwnerByWhere({ id }));

        if(!user) {
            throw new UserDoesntExistException();
        }

        return user;
    }

    async setPassword(token: string, password: IPassword) {
        const entity = await this.getTokenWhere<{ id: string, role: string }>({ token });
        const hash = await password.getHash();

        const data = entity.getData();

        const roleHandler = {
            'employer': () =>
                this.knex('employers')
                    .update({ password: hash.value })
                    .where({ id: data.id }),
            'owner': () =>
                this.knex('owners')
                    .update({ password: hash.value })
                    .where({ id: data.id })
        }

        if(!roleHandler[data.role]) {
            throw new Error("No handler for role!")
        }

        await roleHandler[data.role]();

        await this.knex('tokens')
            .delete()
            .where('token', token);

        return true;
    }

}
