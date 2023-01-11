// import {AuthCredentials} from "./authCredentials";
// import {getAuthCredentials} from "../mocks/getAuthCredentials";
//
// describe('AuthCredentials', () => {
//
//     test("equals should return boolean", async () => {
//         const credentials = await getAuthCredentials()
//         expect(typeof await credentials.equals(await getAuthCredentials(), {} as any)).toBe("boolean");
//     })
//
//     test("If credentials has same email and password, equals will return true", async () => {
//         const credentials = await getAuthCredentials()
//         expect(await credentials.equals(await getAuthCredentials(), {} as any)).toBe(true);
//     })
//
//     test("If credentials has same email but password is different, equals will return false", async () => {
//         const credentials = await getAuthCredentials()
//         expect(await credentials.equals(await getAuthCredentials(undefined, "pass"), {} as any)).toBe(false);
//     })
//
//     test("If credentials has same password but email is different, equals will return false", async () => {
//         const credentials = await getAuthCredentials()
//         expect(await credentials.equals(await getAuthCredentials("mail"), {} as any)).toBe(false);
//     })
//
// })
