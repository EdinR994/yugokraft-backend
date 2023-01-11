import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SkillDto {

    @IsString()
    @ApiProperty({ type: String })
    name: string

    @IsString()
    @ApiProperty({ type: String })
    description: string

}