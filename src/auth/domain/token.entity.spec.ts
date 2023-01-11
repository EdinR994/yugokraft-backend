import {getTokenEntity} from "../mocks/getTokenEntity";
import {ExpiredTokenException} from "./expiredTokenException";

describe("TokenEntity", () => {

    test('if ttl has not passed, tryCheckIfTokenIsExpired would return true', () => {
        expect(getTokenEntity().tryCheckIfTokenIsExpired()).toBe(true);
    })

    test('if ttl has passed, tryCheckIfTokenIsExpired would throw exception', () => {
        expect(() => getTokenEntity(0, new Date().toISOString().split("T")[0]).tryCheckIfTokenIsExpired()).toThrow(new ExpiredTokenException());
    })

    test('if ttl has not passed, data could be fetched', () => {
        expect(getTokenEntity().getData().key).toBe("value");
    })

    test('if ttl has passed, data could not be fetched', () => {
        expect(() => getTokenEntity(0, new Date().toISOString().split("T")[0]).getData()).toThrow(new ExpiredTokenException());
    })

})