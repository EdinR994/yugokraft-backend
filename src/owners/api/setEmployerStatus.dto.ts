import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsUUID} from "class-validator";

export class SetEmployerStatusDto {

    @ApiProperty({ type: [String] })
    @IsUUID(4, { each: true })
    public readonly employerIdList: Array<string>

    @ApiProperty({ type: Boolean })
    @IsBoolean()
    public readonly active: boolean

}