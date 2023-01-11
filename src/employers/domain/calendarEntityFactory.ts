import {EntityFactory} from "../../core/entityFactory";
import {CreateCalendarData} from "./createCalendarData";
import {CalendarEntity} from "./calendar.entity";
import {Inject} from "@nestjs/common";
import {Guid} from "../../core/guid";

export class CalendarEntityFactory implements EntityFactory<CreateCalendarData, string, CalendarEntity> {

    constructor(
        @Inject('Guid')
        private readonly guid: Guid
    ) {}

    from({ employerId, exemptHolidays, interviewDuration, duration, preferredTimeList }: CreateCalendarData): CalendarEntity {
        return new CalendarEntity(this.guid.next(), employerId, duration, exemptHolidays, interviewDuration, preferredTimeList);
    }

}