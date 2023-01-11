import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class SetExpiredDto {

    @ApiProperty({ type: String, example: '83f278e780e4a3b7ef9e4b040dc42ed1d0130e3' })
    @IsString()
    public readonly token: string

}