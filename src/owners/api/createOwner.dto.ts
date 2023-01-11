import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString} from "class-validator";

export class CreateOwnerDto {

    @ApiProperty({ type: String, format: 'email' })
    @IsEmail()
    public readonly email: string

    @ApiProperty({ type: String })
    @IsString()
    public readonly secret: string

}