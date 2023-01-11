export class InterviewDoesntExistException extends Error {
    constructor() {
        super("Interview doesn't exist!");
    }
}