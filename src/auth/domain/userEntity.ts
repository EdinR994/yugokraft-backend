import {AuthCredentials} from "./authCredentials";
import {LoginData} from "./loginData";
import {InvalidLoginCredentialsException} from "./invalidLoginCredentials.exception";
import {Inject, LoggerService} from "@nestjs/common";

export abstract class UserEntity {

    protected constructor(
        public readonly id: string,
        public readonly role: string,
        protected readonly credentials: AuthCredentials,
        @Inject('LoggerService')
        private readonly logger: LoggerService
    ) {}

    protected abstract tryCheckLoginAccess(): boolean;

    async login(credentials: AuthCredentials): Promise<LoginData> {
        this.logger.log(`Trying to to check access`);
        this.tryCheckLoginAccess();
        this.logger.log(`Access checked`);
        const areCredentialsEqual = await this.credentials.equals(credentials, this.logger);
        if(!areCredentialsEqual) {
            throw new InvalidLoginCredentialsException();
        }
        return { id: this.id, role: this.role };
    }

}
