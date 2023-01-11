import {
    ExceptionFilter,
    Injectable,
    Catch,
    ArgumentsHost,
    BadRequestException,
    InternalServerErrorException, LoggerService, Inject
} from "@nestjs/common";
import {EmployerNotActiveException} from "../domain/employerNotActive.exception";
import {InvalidLoginCredentialsException} from "../domain/invalidLoginCredentials.exception";
import {UserDoesntExistException} from "../infrastructure/userDoesntExist.exception";
import { Response } from 'express';
import {ExpiredTokenException} from "../domain/expiredTokenException";
import {PasswordsNotEqualExceptions} from "../domain/passwordsNotEqualExceptions";

@Catch(
    EmployerNotActiveException,
    InvalidLoginCredentialsException,
    UserDoesntExistException,
    ExpiredTokenException,
    PasswordsNotEqualExceptions
)
@Injectable()
export class AuthExceptionFilter implements ExceptionFilter {

    constructor(
        @Inject('LoggerService')
        private readonly logger: LoggerService
    ) {}

    catch(error: Error, host: ArgumentsHost): any {
        this.logger.error(error.message);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const exception = this.getException(error);
        response
            .status(exception.getStatus())
            .json({ ...exception });
    }

    private getException({ message, constructor }: Error) {
        switch (constructor.name) {
            case 'EmployerNotActiveException':
                return new BadRequestException(new Error(message))
            case 'InvalidLoginCredentialsException':
                return new BadRequestException(new Error(message))
            case 'UserDoesntExistException':
                return new BadRequestException(new Error(new InvalidLoginCredentialsException().message))
            case 'ExpiredTokenException':
                return new BadRequestException(new Error(message))
            case 'PasswordsNotEqualExceptions':
                return new BadRequestException(new Error(message));
            default:
                return new InternalServerErrorException()
        }
    }
}