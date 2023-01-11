import {UserEntity} from "./userEntity";
import {AuthCredentials} from "./authCredentials";
import {EmployerNotActiveException} from "./employerNotActive.exception";
import {LoggerService} from "@nestjs/common";

export class EmployerEntity extends UserEntity {

    constructor(
        id: string,
        private readonly active: boolean,
        private readonly name: string,
        credentials: AuthCredentials,
        logger: LoggerService
    ) {
        super(id,  'employer', credentials, logger);
    }

    protected tryCheckLoginAccess(): boolean {
        if(!this.active) {
            throw new EmployerNotActiveException(this.id);
        }
        return true;
    }

}
