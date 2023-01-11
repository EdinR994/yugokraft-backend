import {EntityFactory} from "../../core/entityFactory";
import {InterviewEntity} from "./interview.entity";
import {CreateInterviewData} from "./createInterviewData";
import {Inject} from "@nestjs/common";
import {Guid} from "../../core/guid";

export class InterviewEntityFactoryImpl implements EntityFactory<CreateInterviewData, string, InterviewEntity> {

    constructor(
        @Inject('Guid')
        private readonly guid: Guid
    ) {}

    from({ employerId, candidateId }: CreateInterviewData): InterviewEntity {
        return new InterviewEntity(this.guid.next(), employerId, candidateId);
    }

}