import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, Length} from "class-validator";

export class ContactSupportDto {

    @ApiProperty({ type: String, description: 'email', format: 'email' })
    @IsEmail()
    public readonly sender: string;

    @ApiProperty({ type: String, description: 'Email Message' })
    @Length(1, 500)
    public readonly message: string

}