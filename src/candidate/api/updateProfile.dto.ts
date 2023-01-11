import {IsArray, IsBoolean, IsObject, IsOptional, IsString, ValidateNested} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {JobDto} from "./job.dto";
import {SkillDto} from "./skill.dto";
import {EducationDto} from "./education.dto";
import {LanguageDto} from "./language.dto";

export class UpdateProfileDto {

    @IsString()
    @ApiProperty({ type: String, format: 'uuid' })
    candidateId: string

    @IsString()
    @ApiProperty({ type: String })
    motivation: string

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ type: Boolean, required: false })
    availableForCall?: boolean

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ type: Boolean, required: false })
    havePreviouslyWorked?: boolean

    @IsString()
    @IsOptional()
    @ApiProperty({ type: String, required: false  })
    whenReadyToWork?: string

    @IsString()
    @IsOptional()
    @ApiProperty({ type: String, required: false  })
    desiredRegion?: string

    @IsString()
    @IsOptional()
    @ApiProperty({ type: String, required: false  })
    experienceAbroad?: string

    @IsArray()
    @IsString({ each: true })
    @ApiProperty({ type: [String]  })
    desiredSpheres: string[]

    @IsArray()
    @ApiProperty( { type: [JobDto] })
    @ValidateNested({ each: true })
    @Type(() => JobDto)
    jobs: JobDto[]

    @IsArray()
    @ApiProperty({ type: [SkillDto] })
    @ValidateNested({ each: true })
    @Type(() => SkillDto)
    skills: SkillDto[]

    @IsArray()
    @ApiProperty({ type: [EducationDto] })
    @ValidateNested({ each: true })
    @Type(() => EducationDto)
    educations: EducationDto[]

    @IsArray()
    @ApiProperty({ type: [LanguageDto] })
    @ValidateNested({ each: true })
    @Type(() => LanguageDto)
    languages: LanguageDto[]

}