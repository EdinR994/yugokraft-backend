import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, Min} from "class-validator";

export class SetRenewalPeriod {

    @ApiProperty({ type: Number, example: 14, description: 'Renewal period in days' })
    @IsNumber()
    @Min(1)
    public readonly renewalPeriod: number

}