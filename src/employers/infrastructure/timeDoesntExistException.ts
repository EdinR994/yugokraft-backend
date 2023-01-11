export class TimeDoesntExistException extends Error {
    constructor() {
        super("No time has been found!");
    }
}