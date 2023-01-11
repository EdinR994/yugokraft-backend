import {getHashedPassword} from "../mocks/getHashedPassword";
import {getPlainPassword} from "../mocks/getPlainPassword";

describe('HashedPassword', () => {

    test("Hashed passwords should be equal to plain version of it", async () => {
        const password = await getHashedPassword();
        expect(await password.equals(getPlainPassword())).toBe(true)
    })

    test("Hashed passwords shouldn't be equal to different plain version", async () => {
        const password = await getHashedPassword();
        expect(await password.equals(getPlainPassword("dummy"))).toBe(false)
    })

})