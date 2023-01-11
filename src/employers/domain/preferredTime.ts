import {CalendarTime} from "./calendarTime";

export class PreferredTime {
    constructor(
        public readonly from: CalendarTime,
        public readonly to: CalendarTime
    ) {}

    equals(time: PreferredTime) {
        const { from, to } = time;
        return this.from.toSeconds() === from.toSeconds() && this.to.toSeconds() === to.toSeconds();
    }

    includes(time: PreferredTime) {
        const { from, to } = time;
        return this.from.toSeconds() <= from.toSeconds() && this.to.toSeconds() >= to.toSeconds();
    }

    getTimeDifference() {
        return this.to.toSeconds() - this.from.toSeconds();
    }

}