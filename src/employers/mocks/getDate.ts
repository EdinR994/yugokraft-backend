import {Clock} from "../../core/clock";

export const getDate = ({
                            from = new Date(),
                            addMonth = 0,
                            addDays = 0,
                            addHours = 0,
                            addMinutes = 0,
                            setMonth = from.getMonth(),
                            setDate = from.getDate(),
                            setHours = from.getHours(),
                            setMinutes = from.getMinutes()
}) => {
    const date = new Date(from);
    date.setMonth(setMonth);
    date.setDate(setDate);
    date.setHours(setHours);
    date.setMinutes(setMinutes)
    const time = (addDays * Clock.Day) + (Clock.Hour * addHours) + (addMinutes * Clock.Minute);
    date.setMonth(date.getMonth() + addMonth);
    date.setTime(date.getTime() + time);
    return date;
}