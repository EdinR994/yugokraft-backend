import {ApiProperty} from "@nestjs/swagger";
import {IsUUID} from "class-validator";

export class InviteForInterviewDto {

    @ApiProperty({ type: [String] })
    @IsUUID(4, { each: true })
    public readonly candidateIdList: string[];

}