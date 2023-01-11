import {getPreferredTime} from "../mocks/getPreferredTime";
import {getCalendarTime} from "../mocks/getCalendarTime";

describe('PreferredTime', () => {

    test('Same preferred time should be equal', () => {
        expect(getPreferredTime().equals(getPreferredTime())).toBe(true);
    })

    test('Different preferred time should not be equal', () => {
        expect(getPreferredTime(getCalendarTime("12:00")).equals(getPreferredTime())).toBe(false);
    })

    test("If time range included within preferred time interval, includes should return true", () => {
        expect(
            getPreferredTime(getCalendarTime("11:00"), getCalendarTime("20:00"))
                .includes(getPreferredTime(getCalendarTime("14:00"), getCalendarTime("15:00")))
        )
            .toBe(true)
    })

    test("If time range intersects preferred time interval, includes should return false", () => {
        expect(
            getPreferredTime(getCalendarTime("11:00"), getCalendarTime("20:00"))
                .includes(getPreferredTime(getCalendarTime("10:00"), getCalendarTime("15:00")))
        )
            .toBe(false)
    })

    test("If time range doesnt intersect preferred time interval, includes should return false", () => {
        expect(
            getPreferredTime(getCalendarTime("11:00"), getCalendarTime("20:00"))
                .includes(getPreferredTime(getCalendarTime("09:00"), getCalendarTime("10:30")))
        )
            .toBe(false)
    })

    test("Preferred time should include itself", () => {
        expect(
            getPreferredTime(getCalendarTime("11:00"), getCalendarTime("20:00"))
                .includes(getPreferredTime(getCalendarTime("11:00"), getCalendarTime("20:00")))
        )
            .toBe(true)
    })

})