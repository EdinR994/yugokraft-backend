import {ApiProperty} from "@nestjs/swagger";
import {IsString, Matches} from "class-validator";

export class CalendarTimeDto {

    @ApiProperty({ type: String, example: '16:00' })
    @IsString()
    public readonly from: string;

    @ApiProperty({ type: String, example: '18:00' })
    @IsString()
    public readonly to: string;

}