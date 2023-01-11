import {AuthCredentials} from "../domain/authCredentials";
import {getPlainPassword} from "./getPlainPassword";
import {getHashedPassword} from "./getHashedPassword";

export const getAuthCredentials = async (email = "mail@example.com", password = "password", encrypted = false) => new AuthCredentials(
    email,
    encrypted
        ? await getHashedPassword(password)
        : getPlainPassword(password)
);