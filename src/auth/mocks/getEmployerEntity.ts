import {EmployerEntity} from "../domain/employerEntity";
import {getAuthCredentials} from "./getAuthCredentials";

export const getEmployerEntity = async (active = true) => new EmployerEntity(
    "id",
    active,
    "name",
    await getAuthCredentials(undefined, undefined, true),
    {} as any
)
