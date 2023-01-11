import {ApiProperty} from "@nestjs/swagger";
import {IsObject, IsOptional} from "class-validator";
import {IntervalDto} from "./interval.dto";

export class GetAllStatisticsDto {

    @ApiProperty({ type: IntervalDto, required: false })
    @IsObject()
    @IsOptional()
    public readonly interval: IntervalDto

}