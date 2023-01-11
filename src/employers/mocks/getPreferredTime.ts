import {getCalendarTime} from "./getCalendarTime";
import {PreferredTime} from "../domain/preferredTime";

export const getPreferredTime = (from = getCalendarTime(), to = getCalendarTime()) => new PreferredTime(
    from,
    to
)