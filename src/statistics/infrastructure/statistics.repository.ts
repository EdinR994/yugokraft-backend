import {StatisticsRepository} from "../domain/statistics.repository";
import {StatisticsRecord} from "../domain/statisticsRecord";
import {InjectKnex} from "nestjs-knex/index";
import Knex from "knex";
import {Interval} from "../domain/interval";

export class SqlStatisticsRepository implements StatisticsRepository {

    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {}

    getStatisticsByKey(key: string, interval?: Interval): Promise<any> {
        const query = this.knex('statistics')
            .distinct('data as key')
            .select([
                this.knex.raw('COUNT(*)::integer as count')
            ])
            .where('key', key)
            .groupBy('data')
            .orderByRaw(this.knex.raw('COUNT(*)::integer DESC'));

        if(interval) {
            query
                .andWhereBetween('created_at', [interval.from, interval.to])
        }

        return query;
    }

    getAllStatistics(interval?: Interval): Promise<any> {

        const withQuery = this.knex('statistics_all')
            .distinct('key')
            .select([
                'value',
                this.knex.raw('COUNT(*) as count')
            ])
            .groupBy(['key', 'value'])
            .orderByRaw(this.knex.raw('COUNT(*) DESC'));

        if(interval) {
            withQuery
                .andWhereBetween('created_at', [interval.from, interval.to])
        }

        const aggregatingQuery = this.knex('s')
            .with('s', withQuery)
            .select([
                'key as category',
                this.knex.raw(`
                    jsonb_agg(jsonb_build_object(
                        'key', s.value,
                        'count', s.count
                    )) as data
                `)
            ])
            .groupBy('key')

        return aggregatingQuery;
    }

    async save(record: StatisticsRecord): Promise<boolean> {

        const statistics = Object.entries(record)
            .filter(([key, value]) => Array.isArray(value) && value.length)
            .map(([key, value]) => (value as any[]).map(e => ({ key, data: { ...record, [key]: e } })))
            .flat();

        await this.knex('statistics')
            .insert(statistics);

        const flattenedRecord = Object
            .entries(record)
            .map(([key, value]) => (
                Array.isArray(value)
                    ? (value as any[]).map(e => ({ key, value: e }))
                    : { key, value }
            ))
            .flat();

        await this.knex('statistics_all')
            .insert(flattenedRecord);

        return true;
    }

}