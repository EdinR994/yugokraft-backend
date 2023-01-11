import {UserEntityMock} from "../mocks/user.entity.mock";
import {getAuthCredentials} from "../mocks/getAuthCredentials";
import {InvalidLoginCredentialsException} from "./invalidLoginCredentials.exception";

describe('UserEntity', () => {

    test("Should be able to login with same credentials", async () => {
        const user = await UserEntityMock.getInstance();
        const { id, role } = await user.login(await getAuthCredentials());
        expect(id).toBe(user.id);
        expect(role).toBe(user.role);
    })

    test("Should be able to login with same credentials and if password is encrypted", async () => {
        const user = await UserEntityMock.getInstance(await getAuthCredentials(undefined, undefined, true));
        const { id, role } = await user.login(await getAuthCredentials());
        expect(id).toBe(user.id);
        expect(role).toBe(user.role);
    })

    test("If if log with wrong password, login must throw exception",  () => {
        expect(async () => {
            const user = await UserEntityMock.getInstance();
            await user.login(await getAuthCredentials(undefined, "dummy"))
        }).rejects.toEqual(new InvalidLoginCredentialsException())
    })

    test("If if log with wrong email, login must throw exception",  () => {
        expect(async () => {
            const user = await UserEntityMock.getInstance();
            await user.login(await getAuthCredentials("dummy"))
        }).rejects.toEqual(new InvalidLoginCredentialsException())
    })

})