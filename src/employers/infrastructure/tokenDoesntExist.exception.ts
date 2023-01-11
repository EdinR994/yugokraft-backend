export class TokenDoesntExistException extends Error {
    constructor() {
        super("Token Doesnt Exist!");
    }
}