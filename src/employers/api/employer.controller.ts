import {
    Body,
    Controller,
    Delete,
    Get,
    Inject, Param, Patch,
    Post,
    UseFilters,
    UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {CreateEmployerDTO} from "./createEmployer.dto";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiOkResponse, ApiParam,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'
import {EmployerService} from "../domain/employer.service";
import {GetAllCandidatesDto} from "./getAllCandidates.dto";
import {EmployersExceptionFilter} from "./employers.exceptionFilter";
import {User} from "../../auth/api/user.decorator";
import {CreateCalendarDto} from "./createCalendar.dto";
import {CalendarInterval} from "../domain/calendarInterval";
import {InviteForInterviewDto} from "./inviteForInterview.dto";
import {ReadModelRepository} from "./readModelRepository";
import {AuthGuard} from "../../auth/api/auth.guard.";
import {CalendarTime} from "../domain/calendarTime";
import {AcquireDateForInterviewDto} from "./acquireDateForInterview.dto";
import {employerCredentialsSchema} from "./employerCredentialsSchema";
import {DeleteEmployerCalendarDto} from "./deleteEmployerCalendar.dto";
import {PreferredTime} from "../domain/preferredTime";
import {InterviewTime} from "../domain/interviewTime";
import {Status} from "../../core/status";
import {GetPendingCandidatesDto} from "./getPendingCandidates.dto";
import {wait} from "../../../lib/wait";
import {ResolveCandidateDto} from "./resolveCandidate.dto";
import {TokenRepository} from "../../auth/domain/token.repository";
import {GetCalendarsByTokenDto} from "./getCalendarsByToken.dto";
import {RolesGuard} from "../../auth/api/role.guard";


@UseFilters(EmployersExceptionFilter)
@ApiTags('employers')
@Controller('employers')
export class EmployerController {

    constructor(
        @Inject('EmployerService')
        private readonly employerService: EmployerService,
        @Inject('ReadModelRepository')
        private readonly readModelRepository: ReadModelRepository,
        @Inject('TokenRepository')
        private readonly tokenRepository: TokenRepository
    ) {}

    @Post('register')
    @ApiResponse({ status: 201, description: 'Employer has been successfully created!' })
    @ApiBadRequestResponse( { status: 400, description: 'Validation rules has been violated!' })
    @UsePipes(new ValidationPipe())
    createEmployer(@Body() createEmployerDTO: CreateEmployerDTO) {
        return this.employerService.createEmployer(createEmployerDTO);
    }

    @ApiBearerAuth()
    @Post('candidates')
    @ApiOkResponse({ description: 'All candidates' })
    @ApiUnauthorizedResponse()
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard, new RolesGuard("employer"))
    getAllCandidates(@Body() getAllCandidatesDTO: GetAllCandidatesDto, @User() { id }) {
        return this.readModelRepository.getAllCandidates({ ...getAllCandidatesDTO, employerId: id });
    }

    @ApiBearerAuth()
    @Post('pending')
    @ApiOkResponse({ description: 'All candidates' })
    @ApiUnauthorizedResponse()
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard, new RolesGuard("employer"))
    getPendingCandidates(@Body() getPendingCandidatesDto: GetPendingCandidatesDto, @User() { id }) {
        return this.readModelRepository.getAllCandidates({ ...getPendingCandidatesDto, employerId: id, status: [Status.Open] });
    }

    @ApiBearerAuth()
    @Post('calendars')
    @ApiOkResponse({ description: 'Calendar has been successfully created!' })
    @ApiUnauthorizedResponse()
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard, new RolesGuard("employer"))
    createCalendar(@Body() createCalendarDTO: CreateCalendarDto, @User() { id }) {
        const start = new Date(createCalendarDTO.start);
        const end = new Date(createCalendarDTO.end);
        const checkStartIfRelevant = new Date(start.toDateString()).getTime() === new Date(new Date().toDateString()).getTime();
        const checkEndIfRelevant = new Date(end.toDateString()).getTime() === new Date(new Date().toDateString()).getTime();
        const checkIfRelevant = checkStartIfRelevant && checkEndIfRelevant;
        return this.employerService.createCalendar({
            ...createCalendarDTO,
            preferredTimeList: createCalendarDTO
                .preferredTimeList
                .map(({ from, to }) => new PreferredTime(CalendarTime.create(from, checkIfRelevant), CalendarTime.create(to, checkIfRelevant))),
            employerId: id,
            duration: CalendarInterval.create(new Date(createCalendarDTO.start), new Date(createCalendarDTO.end), checkIfRelevant)
        });
    }

    @ApiBearerAuth()
    @Get('calendars')
    @ApiUnauthorizedResponse()
    @UseGuards(AuthGuard, new RolesGuard("employer"))
    getAllCalendars(@User() { id }) {
        return this.readModelRepository.getEmployerCalendarsById(id);
    }

    @ApiBearerAuth()
    @Get('credentials')
    @ApiBearerAuth()
    @ApiOkResponse({ schema: employerCredentialsSchema })
    @ApiUnauthorizedResponse()
    @UseGuards(AuthGuard, new RolesGuard("employer"))
    getCredentials(@User() { id }) {
        return this.readModelRepository.getCredentials(id);
    }

    @ApiBearerAuth()
    @Post('inviteForInterview')
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'All candidates' })
    @ApiUnauthorizedResponse()
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard, new RolesGuard("employer"))
    async inviteForInterview(@Body() { candidateIdList }: InviteForInterviewDto, @User() { id }) {
        for (const candidateId of candidateIdList) {
            await this.employerService.inviteForInterview(id, candidateId);
            await wait();
        }
        return true;
    }



    @Post('acquireDateForInterview')
    @ApiOkResponse({ description: 'All candidates' })
    @ApiUnauthorizedResponse()
    @UsePipes(new ValidationPipe())
    async acquireDateForInterview(@Body() body: AcquireDateForInterviewDto) {
        const date = new Date(body.date);
        const checkIfRelevant = new Date(date.toDateString()).getTime() === new Date(new Date().toDateString()).getTime();
        const time = InterviewTime.create(
            date,
            new PreferredTime(
                CalendarTime.create(body.time.from, checkIfRelevant, body.offset),
                CalendarTime.create(body.time.to, checkIfRelevant, body.offset)
            ),
            checkIfRelevant
        )
        return this.employerService.acquireDateForInterview({
            ...body,
            time,
            offset: body.offset
        });
    }

    @Post('calendars/:token')
    @ApiOkResponse({ description: 'All candidates' })
    @ApiParam({
        name: 'token'
    })
    @ApiUnauthorizedResponse()
    @UsePipes(new ValidationPipe())
    getCalendarsByToken(@Param('token') token: string, @Body() { timezone }: GetCalendarsByTokenDto) {
        return this.readModelRepository.getEmployerCalendarsByInterviewToken(token, timezone);
    }

    @ApiBearerAuth()
    @Delete('deleteCalendar')
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'All candidates' })
    @ApiUnauthorizedResponse()
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard, new RolesGuard("employer"))
    deleteEmployerCalendar(@Body() { calendarId }: DeleteEmployerCalendarDto, @User() { id }) {
        return this.employerService.deleteEmployerCalendar(id, calendarId);
    }

    @ApiBearerAuth()
    @Patch('resolveCandidates')
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'All candidates' })
    @ApiUnauthorizedResponse()
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard, new RolesGuard("employer"))
    async resolveCandidates(@Body() { candidateIdList, status }: ResolveCandidateDto, @User() { id }) {
        for (const candidateId of candidateIdList) {
            await this.employerService.resolveCandidate(id, candidateId, status);
            await wait();
        }
        return true;
    }

}