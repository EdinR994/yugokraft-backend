import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsUUID, Max, Min} from "class-validator";
import {Status} from "../../core/status";

export class ResolveCandidateDto {

    @ApiProperty({ type: [String] })
    @IsUUID(4, { each: true })
    public readonly candidateIdList: string[]

    @ApiProperty({
        type: Number,
        enum: [Status.Hired, Status.Rejected, Status.DidntShowUp],
        description: `
            Hired - ${Status.Hired}
            Rejected - ${Status.Rejected}
            Didn't Show Up - ${Status.DidntShowUp}
        `
    })
    @IsNumber()
    @Min(Status.Hired)
    @Max(Status.DidntShowUp)
    public readonly status: number

}