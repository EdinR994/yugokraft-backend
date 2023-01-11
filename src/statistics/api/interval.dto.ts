import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class IntervalDto {

    @ApiProperty({ type: Date, example: new Date().toISOString().split("T")[0] })
    @IsString()
    public readonly from: Date;

    @ApiProperty({ type: Date, example: new Date().toISOString().split("T")[0] })
    @IsString()
    public readonly to: Date;

}