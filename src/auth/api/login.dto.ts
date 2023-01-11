import {IsEmail, Length} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {

    @ApiProperty({ type: String, maxLength: 40, minLength: 4, format: 'email' })
    @IsEmail()
    public readonly email: string;

    @ApiProperty({ type: String, minLength: 7, maxLength: 40 })
    @Length(8)
    public readonly password: string;

}