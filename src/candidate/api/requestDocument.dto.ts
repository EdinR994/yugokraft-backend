import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class RequestDocumentDto {

        @ApiProperty({ type: [String] })
        @IsString({ each: true })
        public readonly categoryIdList: string[];

        @ApiProperty({ type: String })
        @IsString()
        public readonly note: string;

}