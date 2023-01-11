import {getPlainPassword} from "../mocks/getPlainPassword";
import {HashedPassword} from "./hashedPassword";

describe('PlainPassword', () => {

    test("Equals should return boolean", async () => {
        const actual = await getPlainPassword().equals(getPlainPassword());
        expect(typeof actual).toBe("boolean")
    })

    test("Same plane passwords should be equal", async () => {
        const actual = await getPlainPassword().equals(getPlainPassword());
        expect(actual).toBe(true);
    })

    test("Different plane passwords shouldn't be equal", async () => {
        const actual = await getPlainPassword().equals(getPlainPassword("dummy"));
        expect(actual).toBe(false)
    })

    test("GetHash should return HashedPassword", async () => {
        const actual = await getPlainPassword().getHash();
        expect(actual instanceof HashedPassword).toBe(true);
    })

    test("Hashed version of password should be equal to plain version of it", async () => {
        const actual = await getPlainPassword().equals(await getPlainPassword().getHash());
        expect(actual).toBe(true);
    })

    test("Hashed version of password shouldn't be equal to different plain password", async () => {
        const actual = await getPlainPassword("dummy").equals(await getPlainPassword().getHash());
        expect(actual).toBe(false);
    })

})