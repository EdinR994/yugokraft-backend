import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, Length } from 'class-validator'

export class CreateEmployerDTO {

    @ApiProperty({ type: String, maxLength: 40, minLength: 4 })
    @Length(1, 40)
    public readonly name: string;

    @ApiProperty({ type: String, maxLength: 40, minLength: 4 })
    @Length(1, 40)
    public readonly company: string;

    @ApiProperty({ type: String, maxLength: 40, minLength: 4, format: 'email' })
    @IsEmail()
    public readonly email: string;

}