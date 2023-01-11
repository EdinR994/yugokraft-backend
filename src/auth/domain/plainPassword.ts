import {IPassword} from "./password";
import {PasswordService} from "./password.service";
import {IPasswordService} from "./password.service.i";
import {HashedPassword} from "./hashedPassword";

export class PlainPassword implements IPassword {

    constructor(
        private readonly plain: string,
        private readonly service: IPasswordService = PasswordService.getInstance()
) {}

    async equals(password: IPassword): Promise<boolean> {
        const hash = await password.getHash();
        return this.service.comparePassword(this.plain, hash.value);
    }

    async getHash(): Promise<HashedPassword> {
        const hash = await this.service.hashPassword(this.plain);
        return new HashedPassword(hash)
    }

}