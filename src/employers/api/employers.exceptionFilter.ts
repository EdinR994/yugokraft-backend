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
import {CredentialsDoesntExistsException} from "../infrastructure/credentialsDoesntExistsException";
import {EmployerDoesntExistException} from "../infrastructure/employerDoesntExistException";
import {EmptyCalendarListException} from "../domain/emptyCalendarListException";
import {InterviewAlreadyAcquiredException} from "../domain/interviewAlreadyAcquiredException";
import {InvalidIntervalArgumentException} from "../domain/invalidIntervalArgumentException";
import {InvalidTimeArgumentException} from "../domain/invalidTimeArgumentException";
import {InterviewDoesntExistException} from "../infrastructure/interviewDoesntExistException";
import {TooMuchCalendarsException} from "../domain/tooMuchCalendarsException";
import {InvalidCalendarTimeInListException} from "../domain/invalidCalendarTimeInListException";
import {CalendarDoesntExist} from "../domain/calendarDoesntExist";
import {InvalidInterviewTimeException} from "../domain/invalidInterviewTimeException";
import {ExemptHolidaysViolatedException} from "../domain/exemptHolidaysViolatedException";
import {InvalidStatusException} from "../domain/invalidStatusException";
import {TokenDoesntExistException} from "../infrastructure/tokenDoesntExist.exception";

@Catch(
    DuplicateEmailException,
    CredentialsDoesntExistsException,
    EmployerDoesntExistException,
    EmptyCalendarListException,
    InterviewAlreadyAcquiredException,
    InvalidIntervalArgumentException,
    InvalidTimeArgumentException,
    InterviewDoesntExistException,
    TooMuchCalendarsException,
    InvalidCalendarTimeInListException,
    CalendarDoesntExist,
    InvalidInterviewTimeException,
    ExemptHolidaysViolatedException,
    InvalidStatusException,
    TokenDoesntExistException
)
@Injectable()
export class EmployersExceptionFilter implements ExceptionFilter {

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
            case 'EmployerDoesntExistException':
                return new BadRequestException()
            case 'DuplicateEmailException':
                return new BadRequestException(new Error(message))
            case 'CredentialsDoesntExistsException':
                return new BadRequestException(new Error("Bad Request"))
            case 'EmptyCalendarListException':
                return new BadRequestException(new Error(message))
            case 'InterviewAlreadyAcquiredException':
                return new BadRequestException(new Error(message))
            case 'InvalidIntervalArgumentException':
                return new BadRequestException(new Error("Bad Request"))
            case 'InvalidTimeArgumentException':
                return new BadRequestException(new Error("Bad Request"))
            case 'InterviewDoesntExistException':
                return new BadRequestException(new Error("Bad Request"))
            case 'TooMuchCalendarsException':
                return new BadRequestException(new Error(message))
            case 'InvalidCalendarTimeInListException':
                return new BadRequestException(new Error(message))
            case 'CalendarDoesntExist':
                return new BadRequestException(new Error(message))
            case 'InvalidInterviewTimeException':
                return new BadRequestException(new Error(message))
            case 'ExemptHolidaysViolatedException':
                return new BadRequestException(new Error(message))
            case 'InvalidStatusException':
                return new BadRequestException(new Error(message))
            case 'TokenDoesntExistException':
                return new BadRequestException(new Error('Token has been expired!'))
            default:
                return new InternalServerErrorException(new Error("Internal Server"))
        }
    }
}