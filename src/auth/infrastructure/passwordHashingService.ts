import {PasswordHashingService} from "../domain/passwordHashingService";
import {compare, genSalt, hash} from "bcryptjs"
import {Injectable, Scope} from "@nestjs/common";

@Injectable({ scope: Scope.REQUEST })
export class BcryptPasswordHashingService implements PasswordHashingService {

    async hash(plaintext: string): Promise<string> {
        const salt = await genSalt(14);
        return hash(plaintext, salt);
    }

    compare(plaintext: string, hash: string): Promise<boolean> {
        return compare(plaintext, hash);
    }

}
