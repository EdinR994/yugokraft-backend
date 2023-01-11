import {AuthService} from "./auth.service";
import {AuthRepository} from "./auth.repository";
import {LoginData} from "./loginData";
import {AuthCredentials} from "./authCredentials";
import {Inject, LoggerService} from "@nestjs/common";
import {DomainEvents} from "../../core/domainEvents";
import {ResetPasswordEvent} from "./resetPasswordEvent";
import {SetPasswordData} from "./setPasswordData";
import {PasswordsNotEqualExceptions} from "./passwordsNotEqualExceptions";
import {TokenRepository} from "./token.repository";

export class AuthServiceImpl implements AuthService {

    constructor(
        @Inject('AuthRepository')
        private readonly authRepository: AuthRepository,
        @Inject('TokenRepository')
        private readonly tokenRepository: TokenRepository,
        @Inject('DomainEvents')
        private readonly events: DomainEvents,
        @Inject('LoggerService')
        private readonly logger: LoggerService
    ) {}

    async setPasswordByUserId(userId: string, password: SetPasswordData): Promise<boolean> {
        const { id, role } = await this.authRepository.getById(userId);
        const token = await this.tokenRepository.createToken({ id, role });
        await this.setPassword(token, password);
        return true;
    }

    async login(credentials: AuthCredentials): Promise<LoginData> {
        this.logger.log(`Trying to find user by ${credentials.email}`);
        const user = await this.authRepository.getByEmail(credentials.email);
        this.logger.log(`User found by ${JSON.stringify(user)}`);
        return user.login(credentials);
    }

    async setPassword(token: string, { password, repeatedPassword }: SetPasswordData): Promise<boolean> {
        const arePasswordEquals = await password.equals(repeatedPassword);
        if(!arePasswordEquals) {
            throw new PasswordsNotEqualExceptions();
        }
        return this.authRepository.setPassword(token, password);
    }

    async resetPassword(email: string): Promise<boolean> {
        this.events.push(new ResetPasswordEvent({ email }));
        return true;
    }

}
