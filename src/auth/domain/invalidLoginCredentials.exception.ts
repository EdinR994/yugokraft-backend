export class InvalidLoginCredentialsException extends Error {
    constructor() {
        super("Invalid password or email!");
    }
}