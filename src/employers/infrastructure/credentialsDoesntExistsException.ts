export class CredentialsDoesntExistsException extends Error {
    constructor() {
        super("Credentials doesn't exists!");
    }
}