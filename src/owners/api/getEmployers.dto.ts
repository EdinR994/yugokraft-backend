import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsNumber, IsObject, IsOptional, IsString, Min} from "class-validator";
import {DateIntervalDto} from "./dateInterval.dto";
import {IntegerIntervalDto} from "./integerInterval.dto";

export class GetEmployersDto {

    @ApiProperty({ type: Boolean, example: false })
    @IsBoolean()
    public readonly onlyActive: boolean;

    @ApiProperty({ type: String, required: false })
    @IsString()
    @IsOptional()
    nameOrCompany: string

    @ApiProperty({ type: DateIntervalDto, required: false })
    @IsObject()
    @IsOptional()
    registrationDate: DateIntervalDto;

    @ApiProperty({ type: IntegerIntervalDto, required: false })
    @IsObject()
    @IsOptional()
    interviewed: IntegerIntervalDto;

    @ApiProperty({ type: IntegerIntervalDto, required: false })
    @IsObject({ })
    @IsOptional()
    hired: IntegerIntervalDto;

    @ApiProperty({ type: Number, example: 10 })
    @IsNumber()
    @Min(0)
    size: number;

    @ApiProperty({ type: Number, example: 0 })
    @IsNumber()
    @Min(0)
    page: number;

}