import {Entity} from "./entity";

export interface EntityFactory<I, T, E extends Entity<T>,> {
    from(input: I): E
}