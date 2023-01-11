import {TokenEntity} from "./tokenEntity";

export interface TokenRepository {
    createToken<T>(data: T): Promise<string>;
    delete<T>(token: string): Promise<void>;
    touch(token: string): Promise<boolean>;
    getByToken<T>(token: string): Promise<TokenEntity<T>>;
}