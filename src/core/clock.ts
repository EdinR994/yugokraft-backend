import {DomainEvent} from "./domainEvent";

export interface ClockOptions<T> {
    timeout: number;
    type: "day" | "hour" | "minute" | "second";
    repeat: boolean;
    key: string;
    event: DomainEvent<T>
}

export abstract class Clock {

    public static Day = 86400000;
    public static Hour = 3600000;
    public static Minute = 60000;
    public static Second = 1000;

    abstract setHandler<T>(options: ClockOptions<T>): this
    abstract resetHandler(key: string): this

}