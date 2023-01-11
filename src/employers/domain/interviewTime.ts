import {PreferredTime} from "./preferredTime";
import {InvalidInterviewTimeException} from "./invalidInterviewTimeException";

export class InterviewTime {

    private constructor(
        public readonly date: Date,
        public readonly time: PreferredTime
    ) {}

    static create(date: Date, time: PreferredTime, checkIfRelevant = false) {
        const interviewTime = new InterviewTime(date, time);
        if(checkIfRelevant) {
            if(!interviewTime.isRelevant()) {
                throw new InvalidInterviewTimeException()
            }
        }
        return interviewTime;
    }

    private isRelevant() {
        return new Date(this.date.toDateString()).getTime() >= new Date(new Date().toDateString()).getTime()
    }

    private currentDate() {
        const date = new Date();
        return date;
    }

    private dayBefore() {
        const date = new Date(this.date.getTime());
        date.setHours(this.time.from.getHours());
        date.setMinutes(this.time.from.getMinutes());
        date.setDate(date.getDate() - 1);
        return date;
    }

    private halfAnHourBefore() {
        const date = this.startDate();
        date.setMinutes(date.getMinutes() - 30)
        return date;
    }

    private startDate() {
        const date = new Date(this.date.getTime());
        date.setHours(this.time.from.getHours())
        date.setMinutes(this.time.from.getMinutes())
        return date;
    }

    private endDate() {
        const date = new Date(this.date.getTime());
        date.setHours(this.time.to.getHours())
        date.setMinutes(this.time.to.getMinutes())
        return date;
    }

    private getTimeDiff(x: Date, y: Date) {
        return x <= y
            ? 0
            : x.getTime() - y.getTime()
    }

    leftToDayBefore() {
        return this.getTimeDiff(this.dayBefore(), this.currentDate());
    }

    leftToHalfAnHourBefore() {
        return this.getTimeDiff(this.halfAnHourBefore(), this.currentDate());
    }

    leftToEnd() {
        return this.getTimeDiff(this.endDate(), this.currentDate());
    }

    isHoliday() {
        return this.date.getDay() === 0 || this.date.getDay() === 6
    }

    equals(interviewTime: InterviewTime) {
        return this.date.getTime() === interviewTime.date.getTime() && interviewTime.time.equals(this.time)
    }

    includes(interviewTime: InterviewTime) {
        return this.date.getTime() === interviewTime.date.getTime() && interviewTime.time.includes(this.time)
    }

}