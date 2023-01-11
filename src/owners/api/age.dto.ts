import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class AgeDTO {

    @ApiProperty({ type: Number })
    @IsNumber()
    public readonly from: number

    @ApiProperty({ type: Number, example: 100 })
    @IsNumber()
    public readonly to: number

}