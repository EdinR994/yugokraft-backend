import {InvalidTimeArgumentException} from "./invalidTimeArgumentException";

export class CalendarTime {

    static readonly match = (period: string) => Boolean(period.match(/^\d{2}:\d{2}$/))

    private constructor(
        private readonly time: string
    ) {
        if(!this.isPeriodValid()) {
            throw new InvalidTimeArgumentException()
        }
    }

    static create(time: string, checkIfRelevant = false, offset = 0) {
        if(checkIfRelevant) {
            if(!CalendarTime.isRelevant(time)) {
                throw new InvalidTimeArgumentException();
            }
        }
        return CalendarTime.fromOffset(time, offset);
    }

    static isRelevant(time: string) {
        const timeToCheck = new CalendarTime(time);
        const currentDate = new Date()
        const currentHours = currentDate.getHours()
            .toString()
            .padStart(2, '0');
        const currentMinutes = currentDate.getMinutes()
            .toString()
            .padStart(2, '0');
        const currentTime = new CalendarTime(currentHours + ':' + currentMinutes);
        return timeToCheck.toSeconds() >= currentTime.toSeconds();
    }

    static fromOffset(time: string, offset: number) {
        const hours = new CalendarTime(time).getHours() - offset;
        const minutes = new CalendarTime(time).getMinutes();
        return new CalendarTime(hours.toString().padStart(2, "0") + ':' + minutes.toString().padStart(2, "0"));
    }

    toSeconds() {
        return this.getHours() * 3600 + this.getMinutes() * 60;
    }

    getHours() {
        return Number(this.time.split(":")[0])
    }

    toString() {
        return this.time
    }

    getMinutes() {
        return Number(this.time.split(":")[1])
    }

    equals(calendarTime: CalendarTime) {
        const { time } = calendarTime;
        return this.time === time;
    }

    private isPeriodValid() {
        const { time } = this;
        return CalendarTime.match(time);
    }
}