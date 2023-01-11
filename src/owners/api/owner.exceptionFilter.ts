import {
    ExceptionFilter,
    Injectable,
    Catch,
    ArgumentsHost,
    BadRequestException,
    InternalServerErrorException, Inject, LoggerService
} from "@nestjs/common";
import { Response } from 'express';
import {DuplicateEmailException} from "../infrastructure/duplicateEmailException";
import {InvalidPeriodArgumentException} from "../domain/invalidPeriodArgumentException";

@Catch(
    DuplicateEmailException,
    InvalidPeriodArgumentException
)
@Injectable()
export class OwnerExceptionFilter implements ExceptionFilter {

    constructor(
        @Inject('LoggerService')
        private readonly logger: LoggerService
    ) {}

    catch(error: Error, host: ArgumentsHost): any {
        this.logger.error(error.message, error.stack);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const exception = this.getException(error);
        response
            .status(exception.getStatus())
            .json({ ...exception });
    }

    private getException({ message, constructor }: Error) {
        switch (constructor.name) {
            case 'DuplicateEmailException':
                return new BadRequestException(new Error(message))
            case 'InvalidPeriodArgumentException':
                return new BadRequestException(new Error(message))
            default:
                return new InternalServerErrorException(new Error("Internal Server"))
        }
    }
}