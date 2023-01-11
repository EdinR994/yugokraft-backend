import {CalendarEntity} from "./calendar.entity";

export interface CalendarRepository {
    save(entity: CalendarEntity): Promise<boolean>;
    getAll(employerId: string): Promise<any>;
    getCalendarsByToken(token: string, timezone?: string): Promise<any>;
    deleteEmployerCalendar(employerId: string, calendarId: string): Promise<boolean>;
}