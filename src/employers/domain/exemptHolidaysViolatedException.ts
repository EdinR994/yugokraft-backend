export class ExemptHolidaysViolatedException extends Error {
    constructor() {
        super("Holidays are exempted!");
    }
}