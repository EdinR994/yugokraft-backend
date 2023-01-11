import {IPassword} from "./password";
import {LoggerService} from "@nestjs/common";

export class AuthCredentials {
    constructor(
        public readonly email: string,
        public readonly password: IPassword
    ) {}

    async equals(credentials: AuthCredentials, logger: LoggerService): Promise<boolean> {
        const isPasswordEquals = await this.password.equals(credentials.password);

        logger.log(`Are password are equals ${isPasswordEquals}`);
        logger.log(`Emails  are equals ${credentials.email === this.email}`);
        return credentials.email === this.email && isPasswordEquals;
    }
}
