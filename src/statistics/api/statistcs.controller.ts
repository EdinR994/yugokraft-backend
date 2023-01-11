import {Body, Controller, Inject, Post, UseGuards, UsePipes, ValidationPipe} from "@nestjs/common";
import {StatisticsRepository} from "../domain/statistics.repository";
import {GetAllStatisticsDto} from "./getAllStatistics.dto";
import {GetStatisticsDto} from "./getStatistics.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../../auth/api/auth.guard.";

@Controller('/statistics')
@ApiTags('statistics')
export class StatisticsController {

    constructor(
        @Inject('StatisticsRepository')
        private readonly repository: StatisticsRepository
    ) {}

    @Post('all')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    getStatisticAll(@Body() body: GetAllStatisticsDto) {
        return this.repository.getAllStatistics(body.interval);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    getStatistic(@Body() body: GetStatisticsDto) {
        return this.repository.getStatisticsByKey(body.key, body.interval);
    }

}