import {CalendarInterval} from "./calendarInterval";
import {InvalidIntervalArgumentException} from "./invalidIntervalArgumentException";
import {getDate} from "../mocks/getDate";

describe("CalendarInterval", () => {

    test("Interval can include max date", () => {
        const furthestDate = getDate({ from: CalendarInterval.getMaxDate() });
        expect(() => CalendarInterval.create(new Date(), furthestDate)).not.toThrow(new InvalidIntervalArgumentException());
    })

    test("Interval cant be further than max date", () => {
        const furthestDate = getDate({ from: CalendarInterval.getMaxDate(), addDays: 1 });
        expect(() => CalendarInterval.create(new Date(), furthestDate)).toThrow(new InvalidIntervalArgumentException());
    })

    test("Interval start cant be further than end", () => {
        const dateFurther = getDate({});
        dateFurther.setMonth(dateFurther.getMonth() + 1);
        expect(() => CalendarInterval.create(dateFurther, new Date())).toThrow(new InvalidIntervalArgumentException());
    })

    test("Interval start and end could be equal", () => {
        const date = getDate({});
        expect(() => CalendarInterval.create(date, date)).not.toThrow(new InvalidIntervalArgumentException());
    })

    test("If interval end is future date, isIntervalRelevant should return true", () => {
        const futureDate = getDate({ addMonth: 1 });
        expect(CalendarInterval.create(new Date(), futureDate).isIntervalRelevant()).toBe(true);
    })

    test("If interval end is current date, isIntervalRelevant should return true", () => {
        expect(CalendarInterval.create(new Date(), new Date()).isIntervalRelevant()).toBe(true);
    })

    test("If interval end is past date, isIntervalRelevant should return false", () => {
        const past = getDate({ addMonth: -1 });
        const start = getDate({ from: past, addMonth: -1 });
        expect(CalendarInterval.create(start, past).isIntervalRelevant()).toBe(false);
    })

    test("If interval includes date, isDateIncludedInInterval should return true", () => {
        const end = getDate({ addMonth: 1 });
        const date = getDate({ addDays: 15 });
        expect(CalendarInterval.create(new Date(), end).isDateIncludedInInterval(date)).toBe(true);
    })

    test("If interval dont include date, isDateIncludedInInterval should return false", () => {
        const end = getDate({ addMonth: 1 });
        const date = getDate({ addMonth: 2 });
        expect(CalendarInterval.create(new Date(), end).isDateIncludedInInterval(date)).toBe(false);
    })

    test("If check relevant is active, cant create interval which end date is in the past", () => {
        const past = getDate({ addMonth: -1 });
        const start = getDate({ addMonth: -1, from: past })
        expect(() => CalendarInterval.create(start, past, true)).toThrow(new InvalidIntervalArgumentException());
    })

})