export class EmptyCalendarListException extends Error {
    constructor() {
        super("Create at least one calendar!");
    }
}