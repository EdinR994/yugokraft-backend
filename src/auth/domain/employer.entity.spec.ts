import {getEmployerEntity} from "../mocks/getEmployerEntity";
import {getAuthCredentials} from "../mocks/getAuthCredentials";
import {EmployerNotActiveException} from "./employerNotActive.exception";

describe("EmployerEntity", () => {

    test("Active employer should be able to login", async () => {
        const employer = await getEmployerEntity();
        expect(await employer.login(await getAuthCredentials())).toBeTruthy()
    })

    test("Disabled employer shouldn't be able to login", async () => {
        const employer = await getEmployerEntity(false);
        await expect(async () => await employer.login(await getAuthCredentials())).rejects.toEqual(new EmployerNotActiveException(employer.id))
    })

})