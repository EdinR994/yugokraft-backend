import {PasswordHashingService} from "./passwordHashingService";
import {Inject, Injectable, Scope} from "@nestjs/common";
import {HashedPassword} from "./hashedPassword";

export interface IPassword {
    equals(password: IPassword): Promise<boolean>;
    getHash(): Promise<HashedPassword>;
}