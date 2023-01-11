import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class IntegerIntervalDto {

    @ApiProperty({ type: Number, example: 0 })
    @IsNumber()
    public readonly from: number

    @ApiProperty({ type: Number, example: 1000 })
    @IsNumber()
    public readonly to: number

}