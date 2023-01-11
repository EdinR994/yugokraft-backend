export class EmployerDoesntExistException extends Error {
    constructor() {
        super("Employer doesnt exist!");
    }
}