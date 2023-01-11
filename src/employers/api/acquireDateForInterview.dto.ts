import {ApiProperty} from "@nestjs/swagger";
import {CalendarTimeDto} from "./calendarTime.dto";
import {IsNumber, IsString, IsUUID, Matches} from "class-validator";

export class AcquireDateForInterviewDto {

    @ApiProperty({ type: String })
    @IsString()
    token: string;

    @ApiProperty({ type: Date, example: new Date().toISOString().split("T")[0] })
    @IsString()
    date: Date;

    @ApiProperty({ type: CalendarTimeDto })
    time: CalendarTimeDto;

    @ApiProperty({ type: Number, default: 0, description: 'Timezone offset' })
    @IsNumber()
    offset: number

}