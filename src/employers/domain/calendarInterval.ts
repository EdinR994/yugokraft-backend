import {InvalidIntervalArgumentException} from "./invalidIntervalArgumentException";

export class CalendarInterval {

    public static getMaxDate() {
        const date = new Date(new Date().toLocaleDateString());
        const numberOfMonth = 2;
        date.setMonth(date.getMonth() + numberOfMonth);
        return date;
    }

    private constructor(
        private readonly start: Date,
        private readonly end: Date
    ) {
        if(!this.isIntervalValid()) {
            throw new InvalidIntervalArgumentException();
        }
    }

    static create(start: Date, end: Date, checkIfRelevant = false) {
        const interval = new CalendarInterval(start, end);
        if(checkIfRelevant) {
            if(!interval.isIntervalRelevant()) {
                throw new InvalidIntervalArgumentException();
            }
        }
        return interval;
    }

    isIntervalRelevant() {
        return this.end >= new Date(new Date().toDateString())
    }

    isDateIncludedInInterval(date: Date) {
        return date >= this.start  && date <= this.end;
    }

    private startFurtherThanEnd() {
        const { start, end } = this
        return start > end;
    }

    private violateMaxDate() {
        const { end } = this;
        return new Date(end.toLocaleDateString()) > CalendarInterval.getMaxDate();
    }

    private isIntervalValid() {
        return !(this.violateMaxDate() || this.startFurtherThanEnd());
    }

}