import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsDateString, IsString, Matches} from "class-validator";

export class JobDto {

    @ApiProperty({ type: Date, format: 'date' })
    @IsString()
    @Matches(new RegExp('^\\d{4}-\\d{2}-\\d{1,2}$'))
    public readonly from: string

    @ApiProperty({ type: Date, format: 'date' })
    @IsString()
    @Matches(new RegExp('^\\d{4}-\\d{2}-\\d{1,2}$'))
    public readonly to: string

    @ApiProperty({ type: String })
    @IsString()
    public readonly company: string

    @ApiProperty({ type: Boolean })
    @IsBoolean()
    public readonly present: boolean

    @ApiProperty({ type: String })
    @IsString()
    public readonly position: string

    @ApiProperty({ type: String })
    @IsString()
    public readonly specialization: string

    @ApiProperty({ type: String })
    @IsString()
    public readonly responsibilities: string

}