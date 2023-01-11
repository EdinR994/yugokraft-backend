export class CandidateDoesntExistException extends Error {
    constructor() {
        super("Candidate doesnt exist!");
    }
}