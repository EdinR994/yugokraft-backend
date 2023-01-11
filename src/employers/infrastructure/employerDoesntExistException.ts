export class EmployerDoesntExistException extends Error {
    constructor() {
        super("Employer doesn't exist!");
    }
}