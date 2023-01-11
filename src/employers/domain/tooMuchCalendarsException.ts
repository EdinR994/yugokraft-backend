export class TooMuchCalendarsException extends Error {
    constructor(maxCalendars: number) {
        super(`Cant create more than ${maxCalendars} calendars!`);
    }
}