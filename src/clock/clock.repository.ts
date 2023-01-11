import {ClockOptions} from "../core/clock";

export interface ClockRepository {
    getCurrentClockOptions(): Promise<Array<ClockOptions<any>>>;
    save(options: ClockOptions<any>): Promise<void>;
    reset(key: string): Promise<void>;
}