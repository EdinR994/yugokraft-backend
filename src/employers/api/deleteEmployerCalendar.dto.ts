import {ApiProperty} from "@nestjs/swagger";
import {IsUUID} from "class-validator";

export class DeleteEmployerCalendarDto {
    @ApiProperty({ type: String })
    @IsUUID()
    calendarId: string
}