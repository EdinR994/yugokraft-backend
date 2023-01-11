import {UserEntity} from "../domain/userEntity";
import {getAuthCredentials} from "./getAuthCredentials";
import {AuthCredentials} from "../domain/authCredentials";

export class UserEntityMock extends UserEntity {

    public static async getInstance(credentials?: AuthCredentials | undefined) {
        return new UserEntityMock(
            "id",
            "role",
            credentials
                ? credentials
                : await getAuthCredentials(),
            {} as any
        )
    }

    protected tryCheckLoginAccess(): boolean {
        return true;
    }
}
