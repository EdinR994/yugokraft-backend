import {PasswordHashingService} from "../domain/passwordHashingService";
import {createHash, randomBytes} from "crypto"

export class PasswordHashingServiceMock implements PasswordHashingService {
    compare(plaintext: string, hash: string): Promise<boolean> {
        const salt = hash.split("_")[1];
        return Promise.resolve(
            hash === (createHash("sha256")
                .update(plaintext)
                .update(Buffer.from(salt, 'hex'))
                .digest("hex") + '_' + salt)
        );
    }
    hash(plaintext: string): Promise<string> {
        const hash = createHash("sha256");
        const salt = randomBytes(8);
        hash.update(plaintext);
        hash.update(salt);
        return Promise.resolve(hash.digest("hex") + '_' + salt.toString("hex"));
    }
}