export class PasswordsNotEqualExceptions extends Error {
    constructor() {
        super("Given passwords are not equal!");
    }
}