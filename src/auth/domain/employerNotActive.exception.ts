export class EmployerNotActiveException extends Error {
    constructor(private readonly id: string) {
        super("Employer is not active!");
    }
}