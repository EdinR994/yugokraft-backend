import {Clock, ClockOptions} from "../core/clock";
import {Inject, Injectable} from "@nestjs/common";
import {DomainEvents} from "../core/domainEvents";
import {ClockRepository} from "./clock.repository";

interface ClockValue<T> {
    timer: NodeJS.Timeout,
    options: ClockOptions<T>
}


@Injectable()
export class ClockService extends Clock {

    private readonly periodTypes = {
        "day": Clock.Day,
        "hour": Clock.Hour,
        "minute": Clock.Minute,
        "second": Clock.Second
    }

    private readonly timers: Map<string, ClockValue<any>> = new Map<string, ClockValue<any>>();
    private readonly passedDays: Map<string, number> = new Map<string, number>();

    constructor(
        @Inject('DomainEvents')
        private readonly events: DomainEvents,
        @Inject('ClockRepository')
        private readonly repository: ClockRepository
    ) {
        super();
        setTimeout(async () => {
            const options = await this.repository.getCurrentClockOptions();
            options.map(option => this.setHandler({
                ...option,
                timeout: Math.round(option.timeout/this.periodTypes[option.type])
            }));
        }, Clock.Second)
    }

    private clearTimer(key: string): void {
        const options = this.timers.get(key);
        if(options) {
            clearTimeout(options.timer);
        }
    }

    private isTimerEnded(key: string, days: number): boolean {
        const passedDays = this.passedDays.get(key) || 0;
        return passedDays === days;
    }

    private resetClock(key: string): void {
        this.passedDays.set(key, 0)
    }

    private increaseDays(key: string): void {
        this.passedDays.set(key, (this.passedDays.get(key) || 0) + 1)
    }

    setHandler<T>(options: ClockOptions<T>): this {
        this.clearTimer(options.key);
        if(this.isTimerEnded(options.key, options.timeout)) {
            this.events.push(options.event);
            if(options.repeat) {
                this.resetClock(options.key);
                setImmediate(async () => await this.repository.reset(options.key));
            } else {
                this.timers.delete(options.key)
                this.passedDays.delete(options.key)
                return this;
            }
        }
        const timeout = setTimeout(() => this.setHandler(options), this.periodTypes[options.type]);
        this.timers.set(options.key, { options, timer: timeout });
        this.increaseDays(options.key);
        setImmediate(async () => await this.repository.save(options));
        return this;
    }

    resetHandler(key: string): this {
        this.clearTimer(key);
        this.resetClock(key);
        return this;
    }

}