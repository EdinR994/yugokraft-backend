export interface IPasswordService {
    comparePassword(plaintext: string, hash: string): Promise<boolean>;
    hashPassword(plaintext: string): Promise<string>
}