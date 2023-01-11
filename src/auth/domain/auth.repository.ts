import {UserEntity} from "./userEntity";
import {IPassword} from "./password";

export interface AuthRepository {
    getByEmail(email: string): Promise<UserEntity>;
    getById(id: string): Promise<UserEntity>;
    setPassword(token: string, password: IPassword)
}