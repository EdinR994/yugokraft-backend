import {CalendarTime} from "./calendarTime";
import {InvalidTimeArgumentException} from "./invalidTimeArgumentException";

describe('CalendarTime', () => {

    test("Input time string should meet validation rules", () => {
        const valid = "18:00";
        expect(() => CalendarTime.create((valid))).not.toThrow(new InvalidTimeArgumentException())
    });

    test("Input time string should meet validation rules", () => {
        const invalid = [
            "1800",
            "18 00",
            "1:00",
            "8:00",
            "18:0",
            "18",
            ":00",
            "18:",
            "38420342834792:338492138427934",
            ":"
        ];
        for(let i = 0; i < invalid.length; i ++) {
            expect(() => CalendarTime.create((invalid[i]))).toThrow(new InvalidTimeArgumentException())
        }
    });

    test("If time is more or equal current time, its relevant", () => {
        const hours = new Date().getHours().toString().padStart(2, '0');
        const minutes = new Date().getMinutes().toString().padStart(2, '0');
        expect(CalendarTime.isRelevant(hours + ':' + minutes)).toBe(true);
    });

    test("If time is less than current time, its not relevant", () => {
        const hours = (new Date().getHours() - 1).toString().padStart(2, '0');
        const minutes = new Date().getMinutes().toString().padStart(2, '0');
        expect(CalendarTime.isRelevant(hours + ':' + minutes)).toBe(false);
    })

    test("If checkIsRelevant true, created time must be relevant", () => {
        const hours = (new Date().getHours() - 1).toString().padStart(2, '0');
        const minutes = new Date().getMinutes().toString().padStart(2, '0');
        expect(() => CalendarTime.create(hours + ':' + minutes, true)).toThrow(new InvalidTimeArgumentException());
    })

    test("If offset is set and it is unsigned, created time must be equal subtraction of passed time and offset", () => {
        const hours = 18;
        const minutes = '00';
        const offset = 2;
        expect(CalendarTime.create(hours.toString() + ':' + minutes, false, offset).getHours()).toBe(hours - offset);
    })

    test("If offset is set and it is signed, created time must be equal subtraction of passed time and offset", () => {
        const hours = 18;
        const minutes = '00';
        const offset = -2;
        expect(CalendarTime.create(hours.toString() + ':' + minutes, false, offset).getHours()).toBe(hours - offset);
    })

    test("getHours should return amount of hours", () => {
        const time = "18:00";
        const expected = 18;
        expect(CalendarTime.create(time).getHours()).toBe(expected);
    })

    test("getMinutes should return amount of minutes", () => {
        const time = "18:30";
        const expected = 30;
        expect(CalendarTime.create(time).getMinutes()).toBe(expected);
    })

    test("Same calendar time should be equal", () => {
        const time = "18:00";
        expect(CalendarTime.create(time).equals(CalendarTime.create(time))).toBe(true);
    })

    test("Different calendar time shouldn't be equal", () => {
        expect(CalendarTime.create("18:00").equals(CalendarTime.create("17:00"))).toBe(false);
    })

})