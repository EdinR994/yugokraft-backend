export class InterviewAlreadyAcquiredException extends Error {
    constructor() {
        super("Interview date has been acquired earlier!");
    }
}