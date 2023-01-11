export class InvalidInterviewTimeException extends Error {
    constructor() {
        super("Invalid time in interview for current calendar!");
    }
}