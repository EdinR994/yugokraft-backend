import {Entity} from "../../core/entity";
import {InterviewEntity} from "./interview.entity";
import {CalendarInterval} from "./calendarInterval";
import {InterviewAlreadyAcquiredException} from "./interviewAlreadyAcquiredException";
import {InvalidCalendarTimeInListException} from "./invalidCalendarTimeInListException";
import {PreferredTime} from "./preferredTime";
import {InterviewTime} from "./interviewTime";
import {InvalidInterviewTimeException} from "./invalidInterviewTimeException";
import {ExemptHolidaysViolatedException} from "./exemptHolidaysViolatedException";

export class CalendarEntity implements Entity<string> {

    constructor(
        public readonly id: string,
        private readonly employerId: string,
        private readonly interval: CalendarInterval,
        private readonly exemptHolidays: boolean,
        private readonly interviewDuration: number,
        private readonly preferredTimeList: Array<PreferredTime> = [],
        private readonly interviews: Array<InterviewEntity> = [],
    ) {
        this.validatePreferredTimeList()
    }

    private validatePreferredTimeList() {
        for(const time of this.preferredTimeList) {
            if(time.getTimeDifference() < this.interviewDuration) {
                throw new InvalidCalendarTimeInListException()
            }
        }
    }

    isCalendarRelevant() {
        return this.interval.isIntervalRelevant();
    }

    getInterviewList() {
        return this.interviews;
    }

    addInterview(interview: InterviewEntity, time: InterviewTime) {
        const intersectingInterview = this.interviews.find(entity => entity.intersects(time))

        if(time.isHoliday() && this.exemptHolidays) {
            throw new ExemptHolidaysViolatedException();
        }

        if(time.time.getTimeDifference() !== this.interviewDuration) {
            throw new InvalidInterviewTimeException();
        }

        if(intersectingInterview) {
            throw new InterviewAlreadyAcquiredException();
        }

        this.interviews.push(interview.setTime(time));
    }

    doesDateIntersectCalendar(date: Date) {
        return this.interval.isDateIncludedInInterval(date);
    }

    doesTimeIncludedInPreferredList(time: PreferredTime) {
        return Boolean(this.preferredTimeList.find((timeInterval) => timeInterval.includes(time)));
    }

    doesTimeDifferenceEqualsInterviewDuration(time: PreferredTime) {
        return time.getTimeDifference() === this.interviewDuration;
    }

}