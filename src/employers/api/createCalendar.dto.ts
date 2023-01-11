import {CalendarTimeDto} from "./calendarTime.dto";
import {ApiProperty} from "@nestjs/swagger";
import {ArrayMinSize, IsArray, IsBoolean, IsDateString, IsNumber, IsObject, IsString, Matches} from "class-validator";

export class CreateCalendarDto {

    @ApiProperty({ type: String, format: 'date'  })
    @IsString()
    public readonly start: Date;

    @ApiProperty({ type: String, format: 'date' })
    @IsString()
    public readonly end: Date;

    @ApiProperty({ type: Number, example: 3600, description: 'Duration in seconds' })
    @IsNumber()
    public readonly interviewDuration: number;

    @ApiProperty({ type: Boolean })
    @IsBoolean()
    public readonly exemptHolidays: boolean;

    @ApiProperty({ type: [CalendarTimeDto] })
    @IsObject({ each: true })
    @ArrayMinSize(1)
    public readonly preferredTimeList: Array<CalendarTimeDto>;

}