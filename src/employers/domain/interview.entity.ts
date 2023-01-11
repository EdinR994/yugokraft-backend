import {Entity} from "../../core/entity";
import {InterviewTime} from "./interviewTime";

export class InterviewEntity implements Entity<string> {

    constructor(
        public readonly id: string,
        public readonly employerId: string,
        public readonly candidateId: string,
        private readonly time?: InterviewTime
    ) {}

    setTime(time: InterviewTime) {
        return new InterviewEntity(
            this.id,
            this.employerId,
            this.candidateId,
            time
        );
    }

    intersects(time: InterviewTime) {
        return this.time.includes(time);
    }

}