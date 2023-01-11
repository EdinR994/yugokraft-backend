import {
    ExceptionFilter,
    Injectable,
    Catch,
    ArgumentsHost,
    BadRequestException,
    InternalServerErrorException,
    Inject,
    LoggerService
} from "@nestjs/common";
import { Response } from 'express';
import {CandidateDoesntExistException} from "../infrastructure/candidateDoesntExistException";
import {CategoryDoesntExistException} from "../infrastructure/categoryDoesntExistException";
import {TokenDoesntExistException} from "../infrastructure/tokenDoesntExistException";

@Catch(
    CandidateDoesntExistException,
    CategoryDoesntExistException,
    TokenDoesntExistException
)
@Injectable()
export class CandidateExceptionFilter implements ExceptionFilter {

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
            case 'CandidateDoesntExistException':
                return new BadRequestException(new Error("Bad Request"))
            case 'CategoryDoesntExistException':
                return new BadRequestException(new Error("Bad Request"))
            case 'TokenDoesntExistException':
                return new BadRequestException(new Error("Bad Request"))
            default:
                return new InternalServerErrorException(new Error("Internal Server"))
        }
    }
}