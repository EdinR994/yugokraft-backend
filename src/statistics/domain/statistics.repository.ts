import {StatisticsRecord} from "./statisticsRecord";
import {Interval} from "./interval";

export interface StatisticsRepository {
    getStatisticsByKey(key: string, interval?: Interval): Promise<any>;
    getAllStatistics(interval?: Interval): Promise<any>;
    save(record: StatisticsRecord): Promise<boolean>;
}