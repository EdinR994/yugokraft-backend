import {DomainEvents} from "../src/core/domainEvents";
import {DomainEvent} from "../src/core/domainEvent";
import {Injectable, Logger} from "@nestjs/common";
import {createWriteStream} from "fs";
import pino from "pino";
import {Semaphore} from "./sempahore";

@Injectable()
export class DomainEventsImpl implements DomainEvents {

    private readonly semaphore: Semaphore = new Semaphore(1, 100);

    private constructor(
        private readonly handlers: Map<string, (data: any) => void> = new Map<string, (data: any) => void>(),
        private readonly logger = pino({
            timestamp: true
        }, createWriteStream(`/var/log/event_log.log`, {
            flags: 'a'
        }))
    ) {}

    private getHandler<T>(event: DomainEvent<T>) {
        return async () => {
            this.logger.info({ event: event.name, status: 'PUBLISHING' });
            const handler = this.handlers.get(event.name);
            if(!handler) {
                this.logger.error({ event: event.name, status: 'FAILED', error: { message: 'No handlers registered' } });
                return;
            }
            try {
                await handler(event.data);
                this.logger.info({ event: event.name, status: 'PUBLISHED' });
            } catch (e) {
                this.logger.error({ event: event.name, status: 'FAILED', error: { message: e.message, stack: e.stack } });
            }
        }
    }

    push<T>(event: DomainEvent<T>): this {
        setImmediate(async () => {
            await this.semaphore.acquire();
            await this.getHandler(event)();
            this.semaphore.free();
        })
        return this;
    }

    on<T>(event: string, handler: (data: T) => void): this {
        this.handlers.set(event, handler);
        return this;
    }

    private static instance: DomainEventsImpl | null = null;

    public static getInstance(): DomainEventsImpl {
        if(!this.instance) {
            this.instance = new DomainEventsImpl();
        }
        return this.instance;
    }

}