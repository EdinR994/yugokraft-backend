import {Entity} from "../../core/entity";
import {CalendarEntity} from "./calendar.entity";
import {EmployerCredentials} from "./employerCredentials";
import {CalendarDoesntExist} from "./calendarDoesntExist";
import {TooMuchCalendarsException} from "./tooMuchCalendarsException";
import {InterviewTime} from "./interviewTime";

export class EmployerAggregate implements Entity<string> {

    private static maxCalendars = 4;

    constructor(
        public readonly id: string,
        private readonly credentials: EmployerCredentials,
        private readonly calendars: Array<CalendarEntity> = []
    ) {}

    public getRelevantCalendarLength() {
        return this.calendars
            .filter((calendar) => calendar.isCalendarRelevant()).length;
    }

    public addCalendar(calendar: CalendarEntity) {
        if(this.calendars.length >= EmployerAggregate.maxCalendars) {
            throw new TooMuchCalendarsException(EmployerAggregate.maxCalendars);
        }
        this.calendars.push(calendar);
        return this;
    }

    public getCalendarForInterview(time: InterviewTime) {
        const calendar = this
            .calendars
            .find(calendar => calendar.doesDateIntersectCalendar(time.date) && calendar.doesTimeIncludedInPreferredList(time.time) && calendar.doesTimeDifferenceEqualsInterviewDuration(time.time));

        if(!calendar) {
            throw new CalendarDoesntExist()
        }

        return calendar;
    }

    public findCalendarById(id: string) {
        const calendar = this
            .calendars
            .find(calendar => calendar.id === id);

        if(!calendar) {
            throw new CalendarDoesntExist()
        }

        return calendar;
    }

    public getCredentials() {
        return this.credentials;
    }

}