export class CandidateDoesntExistException extends Error {
    constructor() {
        super("Candidate doesn't exist!");
    }
}