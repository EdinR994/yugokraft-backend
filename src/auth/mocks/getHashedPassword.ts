import {PasswordService} from "../domain/password.service";
import {PasswordHashingServiceMock} from "./passwordHashing.service.mock";
import {getPlainPassword} from "./getPlainPassword";

const service = new PasswordService(
    new PasswordHashingServiceMock()
);

export const getHashedPassword = (plaintext = "password") => getPlainPassword(plaintext).getHash()