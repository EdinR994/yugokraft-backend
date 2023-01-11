import {ClockRepository} from "./clock.repository";
import {InjectKnex} from "nestjs-knex/index";
import Knex from "knex";
import {ClockOptions} from "../core/clock";

export class SqlClockRepository implements ClockRepository {

    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {}

    private areOptionsEqual(a: ClockOptions<any>, b: ClockOptions<any>) {
        return JSON.stringify(Object.assign({}, a, b)) === JSON.stringify(Object.assign({}, a));
    }

    async getCurrentClockOptions(): Promise<Array<ClockOptions<any>>> {
        return this.knex('clocks')
            .select([
                'key',
                'type',
                'repeat',
                this.knex.raw(`jsonb_build_object('name', event, 'data', event_data) as event`),
                this.knex.raw(`ROUND(((extract(epoch from updated_at + CONCAT(timeout::text, ' ', type)::interval) - extract(epoch from NOW())) * 1000)) as timeout`)
            ])
            .whereRaw(this.knex.raw(`updated_at + CONCAT(timeout::text, ' ', type)::interval > current_date`))
            .andWhereRaw(this.knex.raw(`ROUND(((extract(epoch from updated_at + CONCAT(timeout::text, ' ', type)::interval) - extract(epoch from NOW())) * 1000)) > 0`))
    }

    async save(options: ClockOptions<any>): Promise<void> {

        const { timeout, type, repeat, key, event } = options;

        const [duplicate, ...etc]: any[] = await this.knex('clocks')
            .select([
                'key',
                'type',
                'repeat',
                this.knex.raw('timeout::integer'),
                this.knex.raw(`jsonb_build_object('name', event, 'data', event_data) as event`)
            ])
            .where({ key });

        if(duplicate) {
            await this.knex('clocks')
                .update({
                    timeout,
                    type,
                    repeat,
                    event: event.name,
                    'event_data': event.data
                })
                .where({ key })

            if(!this.areOptionsEqual(options, duplicate)) {
                await this.knex('clocks')
                    .update({
                        'updated_at': new Date()
                    })
                    .where({ key })
            }

        } else {
            await this.knex('clocks')
                .insert({
                    timeout,
                    type,
                    repeat,
                    key,
                    event: event.constructor.name,
                    'event_data': event.data
                })
        }

    }

    async reset(key: string) {
        await this.knex('clocks')
            .delete()
            .where({ key })
    }


}