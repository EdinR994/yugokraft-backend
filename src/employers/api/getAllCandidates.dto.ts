import {Status} from "../../core/status";
import {ApiProperty} from '@nestjs/swagger'
import {AgeDTO} from "./age.dto";
import {IsBoolean, IsNumber, IsObject, IsOptional, IsString, Min} from "class-validator";



export class GetAllCandidatesDto {

    @ApiProperty({ type: String, required: false })
    @IsString()
    @IsOptional()
    nameOrEmail: string;

    @ApiProperty({ type: [String], example: [] })
    @IsString({ each: true })
    public readonly degree: string[];

    @ApiProperty({ type: Boolean })
    @IsBoolean()
    public readonly showWithRequestedDocuments: boolean;

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

    @ApiProperty({ type: [Number] })
    @IsNumber({}, { each: true })
    public readonly status: Array<Status>;

    @ApiProperty({ type: Number })
    @IsNumber()
    @Min(0)
    public readonly page: number;

    @ApiProperty({ type: Number, example: 5 })
    @IsNumber()
    @Min(0)
    public readonly size: number;

}
