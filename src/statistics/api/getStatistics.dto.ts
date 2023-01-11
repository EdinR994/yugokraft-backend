import {ApiProperty} from "@nestjs/swagger";
import {IsObject, IsOptional, IsString} from "class-validator";
import {IntervalDto} from "./interval.dto";

export class GetStatisticsDto {

    @ApiProperty({ type: String })
    @IsString()
    public readonly key: string

    @ApiProperty({ type: IntervalDto, required: false })
    @IsObject()
    @IsOptional()
    public readonly interval: IntervalDto

}