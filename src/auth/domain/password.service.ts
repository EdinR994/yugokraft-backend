import {Inject, Injectable} from "@nestjs/common";
import {PasswordHashingService} from "./passwordHashingService";

@Injectable()
export class PasswordService {

    private static instance: PasswordService;

    public static getInstance(): PasswordService {
        return this.instance;
    }

    constructor(
        @Inject('PasswordHashingService')
        private readonly hashingService: PasswordHashingService
    ) {
        PasswordService.instance = this;
    }

    public hashPassword(plaintext: string): Promise<string> {
        return this.hashingService.hash(plaintext)
    }

    public comparePassword(plaintext: string, hash: string): Promise<boolean> {
        return this.hashingService.compare(plaintext, hash);
    }

}