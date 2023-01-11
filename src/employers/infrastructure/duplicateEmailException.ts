export class DuplicateEmailException extends Error {
    constructor() {
        super("Email is already taken!");
    }
}