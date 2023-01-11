import {IsDateString, IsEmail, IsMobilePhone, IsOptional, IsString, Matches, MinDate} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateCandidateDto {

    @IsString()
    @ApiProperty({ type: String, format: 'uuid', required: false })
    @IsOptional()
    id?: string

    @IsString()
    @ApiProperty({ type: String })
    username: string

    @IsEmail()
    @ApiProperty({ type: String, format: 'email' })
    email: string

    @IsString()
    @ApiProperty({ type: String })
    lastName: string

    @ApiProperty({ type: String, format: 'uuid' })
    @ApiProperty()
    countryId: string

    @IsString()
    @ApiProperty({ type: String, example: '+380991233212' })
    phoneNumber: string

    @IsString()
    @Matches(new RegExp('^\\d{4}-\\d{2}-\\d{1,2}$'))
    @ApiProperty({ type: String, format: 'date' })
    dateOfBirth: string

}