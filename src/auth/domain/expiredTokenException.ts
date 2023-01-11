export class ExpiredTokenException extends Error {
    constructor() {
        super("Token has been expired!");
    }
}