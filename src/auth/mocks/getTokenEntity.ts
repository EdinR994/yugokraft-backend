import {TokenEntity} from "../domain/tokenEntity";

export const getTokenEntity = (ttl = 300, date: string = new Date().toISOString()) => new TokenEntity(
    "token",
    { key: "value" },
    ttl,
    date
)