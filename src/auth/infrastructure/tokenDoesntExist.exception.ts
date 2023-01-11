export class TokenDoesntExistException extends Error {
    constructor() {
        super("Token doesn't exist!");
    }
}