import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, Max, Min} from "class-validator";

export class AgeDTO {

    @ApiProperty({ type: Number })
    @IsNumber()
    @Min(0)
    public readonly from: number

    @ApiProperty({ type: Number, example: 100 })
    @IsNumber()
    @Max(100)
    public readonly to: number

}