import {PlainPassword} from "./plainPassword";
import {IPassword} from "./password";

export class HashedPassword implements IPassword {

    constructor(
        public readonly value: string
    ) {}

    async equals(password: PlainPassword): Promise<boolean> {
        return password.equals(this);
    }

    getHash(): Promise<HashedPassword> {
        return Promise.resolve(this);
    }

}