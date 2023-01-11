import {PasswordService} from "./password.service";
import {PasswordHashingServiceMock} from "../mocks/passwordHashing.service.mock";

describe("PasswordService", () => {

    const service = new PasswordService(
        new PasswordHashingServiceMock()
    );
    const plaintext = "password";

    test('getInstance should return instance of Password Service', () => {
        expect(PasswordService.getInstance() instanceof PasswordService).toBe(true);
    });

    test("hashPassword should return string", async () => {
        const hash = await service.hashPassword(plaintext);
        expect(typeof hash).toBe("string");
    });

    test("comparePassword should return boolean", async () => {
        const hash = await service.hashPassword(plaintext);
        const compareResult = await service.comparePassword(plaintext, hash);
        expect(typeof compareResult).toBe("boolean");
    });

    test('hashPassword should return hash string, which could be successfully compared with plaintext password', async () => {
        const hash = await service.hashPassword(plaintext);
        const compareResult = await service.comparePassword(plaintext, hash);
        expect(compareResult).toBe(true);
    })

})
