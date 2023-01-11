import {
    Body,
    Controller, Get, Inject, Patch,
    Post,
    UnauthorizedException, UseFilters, UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {ApiBearerAuth, ApiTags, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {CreateOwnerDto} from "./createOwner.dto";
import {OwnerService} from "../domain/owner.service";
import {AuthGuard} from "../../auth/api/auth.guard.";
import {SetEmployerStatusDto} from "./setEmployerStatus.dto";
import {wait} from "../../../lib/wait";
import {GetEmployersDto} from "./getEmployers.dto";
import {GetCandidateDto} from "./getCandidate.dto";
import {SetRenewalPeriod} from "./setRenewalPeriod";
import {RenewalPeriod} from "../domain/renewalPeriod";
import {OwnerExceptionFilter} from "./owner.exceptionFilter";
import {RolesGuard} from "../../auth/api/role.guard";

@Controller('/owners')
@ApiTags('owners')
@UseFilters(OwnerExceptionFilter)
export class OwnerController {

    constructor(
        @Inject('OwnerService')
        private readonly service: OwnerService
    ) {}

    @Post('register')
    @UsePipes(new ValidationPipe())
    async createOwner(@Body() { email, secret }: CreateOwnerDto) {
        if(secret !== process.env.OWNER_REGISTRATION_SECRET) {
            throw new UnauthorizedException();
        }
        return this.service.createOwner(email);
    }

    @Post('candidates')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard, new RolesGuard("owner"))
    @ApiBearerAuth()
    @ApiUnauthorizedResponse()
    async getCandidateList(@Body() filter: GetCandidateDto) {
        return this.service.getAllCandidates(filter);
    }

    @Post('employers')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard, new RolesGuard("owner"))
    @ApiBearerAuth()
    @ApiUnauthorizedResponse()
    async getEmployerList(@Body() filter: GetEmployersDto) {
        return this.service.getAllEmployers(filter);
    }

    @Patch('setRenewalPeriod')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard, new RolesGuard("owner"))
    @ApiUnauthorizedResponse()
    @ApiBearerAuth()
    setRenewalPeriod(@Body() { renewalPeriod }: SetRenewalPeriod) {
        return this.service.updateRenewalPeriod(new RenewalPeriod(renewalPeriod));
    }

    @Get('getRenewalPeriod')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard, new RolesGuard("owner"))
    @ApiUnauthorizedResponse()
    @ApiBearerAuth()
    async getRenewalPeriod() {
        const renewalPeriod = await this.service.getRenewalPeriod();
        return { days: renewalPeriod.value };
    }

    @Patch('setEmployerStatus')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard, new RolesGuard("owner"))
    @ApiUnauthorizedResponse()
    @ApiBearerAuth()
    async setEmployerStatus(@Body() { employerIdList, active }: SetEmployerStatusDto) {
        for(const id of employerIdList) {
            await this.service.setActiveStatusForEmployer(id, active);
            await wait();
        }
        return true;
    }

}