import {InterviewTime} from "./interviewTime";
import {getDate} from "../mocks/getDate";
import {getCalendarTime} from "../mocks/getCalendarTime";
import {getPreferredTime} from "../mocks/getPreferredTime";

describe('InterviewTime', () => {

    test('leftToDayBefore should return milliseconds left to day before interview date', () => {
        const preferredTime = getPreferredTime(getCalendarTime("18:00"), getCalendarTime("19:00"));
        const date = getDate({ addDays: 1, setHours: 18, setMinutes: 0 });
        const dayBefore = getDate({ from: date, addDays: -1 });
        const interviewTime = InterviewTime
            .create(date, preferredTime);
        const deviation = 10;
        expect(interviewTime.leftToDayBefore()).toBeLessThan(dayBefore.getTime() - new Date().getTime() + deviation);
        expect(interviewTime.leftToDayBefore()).toBeGreaterThan(dayBefore.getTime() - new Date().getTime() - deviation);
    })

    test('leftToDayBefore should return 0 if start date is current date', () => {
        const preferredTime = getPreferredTime(getCalendarTime("18:00"), getCalendarTime("19:00"));
        const date = getDate({});
        const interviewTime = InterviewTime
            .create(date, preferredTime);
        expect(interviewTime.leftToDayBefore()).toBe(0);
    })

    test('leftToHalfAnHourBefore should return milliseconds left to half an hour before interview date', () => {
        const preferredTime = getPreferredTime(getCalendarTime("18:00"), getCalendarTime("19:00"));
        const date = getDate({ addDays: 1, setHours: 18, setMinutes: 0 });
        const dayBefore = getDate({ from: date, addMinutes: -30 });
        const interviewTime = InterviewTime
            .create(date, preferredTime);
        const deviation = 10;
        expect(interviewTime.leftToHalfAnHourBefore()).toBeLessThan(dayBefore.getTime() - new Date().getTime() + deviation);
        expect(interviewTime.leftToHalfAnHourBefore()).toBeGreaterThan(dayBefore.getTime() - new Date().getTime() - deviation);
    })

    test('leftToHalfAnHourBefore should return 0 milliseconds if half an hour before already passed', () => {
        const currentHours = new Date().getHours();
        const preferredTime = getPreferredTime(getCalendarTime(`${currentHours}:00`), getCalendarTime(`${currentHours + 1}:00`));
        const date = getDate({ addMinutes: -30 });
        const interviewTime = InterviewTime
            .create(date, preferredTime);
        expect(interviewTime.leftToHalfAnHourBefore()).toBe(0);
    })

    test('leftToEnd should return milliseconds left to end of the interview', () => {
        const preferredTime = getPreferredTime(getCalendarTime("18:00"), getCalendarTime("19:00"));
        const date = getDate({ addDays: 1, setHours: 19, setMinutes: 0 });
        const interviewTime = InterviewTime
            .create(date, preferredTime);
        const deviation = 10;
        expect(interviewTime.leftToEnd()).toBeLessThan(date.getTime() - new Date().getTime() + deviation);
        expect(interviewTime.leftToEnd()).toBeGreaterThan(date.getTime() - new Date().getTime() - deviation);
    })

    test('leftToEnd should return 0 milliseconds if interview has already ended', () => {
        const currentHours = new Date().getHours();
        const preferredTime = getPreferredTime(getCalendarTime(`${currentHours - 1}:00`), getCalendarTime(`${currentHours}:00`));
        const date = getDate({ setHours: 19, setMinutes: 0 });
        const interviewTime = InterviewTime
            .create(date, preferredTime);
        expect(interviewTime.leftToEnd()).toBe(0);
    })

    test('if current day is holiday, isHoliday should return true', () => {
        const preferredTime = getPreferredTime(getCalendarTime("18:00"), getCalendarTime("19:00"));
        const date = getDate({
            from: new Date("2021-01-23")
        });
        const interviewTime = InterviewTime
            .create(date, preferredTime);
        expect(interviewTime.isHoliday()).toBe(true);
    })

    test('if current day is holiday, isHoliday should return true', () => {
        const preferredTime = getPreferredTime(getCalendarTime("18:00"), getCalendarTime("19:00"));
        const date = getDate({
            from: new Date("2021-01-24")
        });
        const interviewTime = InterviewTime
            .create(date, preferredTime);
        expect(interviewTime.isHoliday()).toBe(true);
    })

    test('if current day is workday, isHoliday should return false', () => {
        const preferredTime = getPreferredTime(getCalendarTime("18:00"), getCalendarTime("19:00"));
        const date = getDate({
            from: new Date("2021-01-22")
        });
        const interviewTime = InterviewTime
            .create(date, preferredTime);
        expect(interviewTime.isHoliday()).toBe(false);
    })

    test('if time intersects interview time, includes should return false', () => {
        const preferredTime = getPreferredTime(getCalendarTime("18:00"), getCalendarTime("19:00"));
        const date = getDate({});
        const dateWhichIntersects = InterviewTime
            .create(date, getPreferredTime(getCalendarTime("17:00"), getCalendarTime("18:30")));
        const interviewTime = InterviewTime
            .create(date, preferredTime);
        expect(interviewTime.includes(dateWhichIntersects)).toBe(false);
    })

    test('interview should include itself', () => {
        const preferredTime = getPreferredTime(getCalendarTime("18:00"), getCalendarTime("19:00"));
        const date = getDate({});
        const interviewTime = InterviewTime
            .create(date, preferredTime);
        const itself = InterviewTime
            .create(date, preferredTime);
        expect(interviewTime.includes(itself)).toBe(true);
    })

    test('If time does not intersect interview time, includes should return false', () => {
        const preferredTime = getPreferredTime(getCalendarTime("18:00"), getCalendarTime("19:00"));
        const date = getDate({});
        const interviewTime = InterviewTime
            .create(date, preferredTime);
        const dateWhichDoesntIntersects = InterviewTime
            .create(date, getPreferredTime(getCalendarTime("17:00"), getCalendarTime("17:30")));
        expect(interviewTime.includes(dateWhichDoesntIntersects)).toBe(false);
    })

})