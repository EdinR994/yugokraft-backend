export interface PasswordHashingService {
    hash(plaintext: string): Promise<string>;
    compare(plaintext: string, hash: string): Promise<boolean>;
}