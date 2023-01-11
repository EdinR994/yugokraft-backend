import {ApiProperty} from "@nestjs/swagger";
import {Length} from "class-validator";

export class SetPasswordDto {
    @ApiProperty()
    @Length(8, 64)
    public readonly password: string

    @ApiProperty()
    @Length(8, 64)
    public readonly repeatedPassword: string
}