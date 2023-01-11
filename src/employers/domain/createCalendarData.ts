import {CalendarInterval} from "./calendarInterval";
import {PreferredTime} from "./preferredTime";

export interface CreateCalendarData {
    duration: CalendarInterval,
    interviewDuration: number,
    exemptHolidays: boolean,
    employerId: string,
    preferredTimeList: Array<PreferredTime>
}