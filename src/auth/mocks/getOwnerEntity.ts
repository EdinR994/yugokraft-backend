import {OwnerEntity} from "../domain/ownerEntity";
import {getAuthCredentials} from "./getAuthCredentials";

export const getOwnerEntity = async () => new OwnerEntity(
    "id",
    await getAuthCredentials(),
    {} as any
)
