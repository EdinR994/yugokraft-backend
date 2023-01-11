import {CalendarTime} from "../domain/calendarTime";

export const getCalendarTime = (time = "18:00") => CalendarTime.create(time);