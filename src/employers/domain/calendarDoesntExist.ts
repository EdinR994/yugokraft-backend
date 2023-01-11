export class CalendarDoesntExist extends Error {
    constructor() {
        super("Calendar doesn't exist!");
    }
}