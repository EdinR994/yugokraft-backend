import {UserEntity} from "./userEntity";
import {AuthCredentials} from "./authCredentials";
import {LoggerService} from "@nestjs/common";

export class OwnerEntity extends UserEntity {

    public constructor(
        id: string,
        credentials: AuthCredentials,
        logger: LoggerService
    ) {
        super(id,'owner', credentials, logger);
    }

    protected tryCheckLoginAccess(): boolean {
        return true;
    }
}
