import {DomainEvent} from "../../core/domainEvent";
import {InterviewEntity} from "./interview.entity";

export interface DeletedCalendarEventData {
    attachedInterviews: Array<InterviewEntity>;
}

export class DeletedCalendarEvent implements DomainEvent<any> {
    public readonly name = 'DeletedCalendarEvent'
    constructor(
        public readonly data: DeletedCalendarEventData
    ) {}
}