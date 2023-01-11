export class CategoryDoesntExistException extends Error {
    constructor() {
        super("Category doesn't exist!");
    }
}