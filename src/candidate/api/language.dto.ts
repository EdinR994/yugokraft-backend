import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class LanguageDto {

    @IsString()
    @ApiProperty({ type: String })
    language: string

    @IsString()
    @ApiProperty({ type: String })
    level: string

}