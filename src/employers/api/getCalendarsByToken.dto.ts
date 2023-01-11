import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsString} from "class-validator";

export class GetCalendarsByTokenDto {

    @ApiProperty({ type: String, required: false, default: 'Europe/Berlin' })
    @IsString()
    @IsOptional()
    public readonly timezone: string

}