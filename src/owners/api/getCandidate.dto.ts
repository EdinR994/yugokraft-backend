import {Status} from "../../core/status";
import {AgeDTO} from "./age.dto";
import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsNumber, IsObject, IsOptional, IsString} from "class-validator";

export class GetCandidateDto {

    @ApiProperty({ type: String, required: false })
    @IsString()
    @IsOptional()
    nameOrEmail: string;

    @ApiProperty({ type: [String], example: [] })
    @IsString({ each: true })
    public readonly degree: string[];

    @ApiProperty({ type: Boolean })
    @IsBoolean()
    public readonly detailed: boolean;

    @ApiProperty({ type: [String], example: [] })
    @IsString({ each: true })
    public readonly experience: string[];

    @ApiProperty({ type: [String], example: [] })
    @IsString({ each: true })
    public readonly languages: string[];

    @ApiProperty({ type: [String], example: [] })
    @IsString({ each: true })
    public readonly skills: string[];

    @ApiProperty({ type: [String], example: [] })
    @IsString({ each: true })
    public readonly jobDetails: string[];

    @ApiProperty({ type: AgeDTO })
    public readonly age: AgeDTO;

    @ApiProperty({ type: [String], example: [] })
    @IsString({ each: true })
    public readonly country: string[];

    @ApiProperty({ type: Boolean, required: false })
    @IsBoolean()
    @IsOptional()
    public readonly eu: boolean;

    @ApiProperty({ type: [Number], example: [], required: false })
    @IsNumber({}, { each: true })
    @IsOptional()
    public readonly status: [(Status.Open | Status.Hired)?, (Status.Hired | Status.Open)?];

    @ApiProperty({ type: Number })
    @IsNumber()
    public readonly page: number;

    @ApiProperty({ type: Number, example: 5 })
    @IsNumber()
    public readonly size: number;

}
