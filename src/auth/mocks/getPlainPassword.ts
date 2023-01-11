import {PasswordService} from "../domain/password.service";
import {PasswordHashingServiceMock} from "./passwordHashing.service.mock";
import {PlainPassword} from "../domain/plainPassword";

const service = new PasswordService(
    new PasswordHashingServiceMock()
);

export const getPlainPassword = (plaintext = "password") => new PlainPassword(
    plaintext,
    service
)