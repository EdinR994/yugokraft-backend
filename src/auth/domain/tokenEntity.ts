import {ExpiredTokenException} from "./expiredTokenException";

export class TokenEntity<T> {
    constructor(
        private readonly token: string,
        private readonly data: T,
        private readonly ttl: number,
        private readonly createdAt: string
    ) {}

    tryCheckIfTokenIsExpired() {
        if(Date.now() - Date.parse(this.createdAt) > this.ttl) {
            throw new ExpiredTokenException()
        }
        return true;
    }

    getData(): T {
        this.tryCheckIfTokenIsExpired();
        return this.data;
    }

}