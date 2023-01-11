import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class EducationDto {

    @IsString()
    @ApiProperty({ type: String })
    degree: string

    @IsString()
    @ApiProperty({ type: String })
    specialty: string

}