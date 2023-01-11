import {Inject} from "@nestjs/common";
import {DomainEvents} from "../../core/domainEvents";
import {DomainEventsImpl} from "../../../lib/domainEvents.impl";
import {StatisticsRepository} from "../domain/statistics.repository";
import {CandidateWhere} from "../../employers/domain/candidateWhere";
import {StatisticsRecord} from "../domain/statisticsRecord";

export class StatisticsEvents {
    constructor(
        @Inject('DomainEvents')
        private readonly events: DomainEvents,
        @Inject('StatisticsRepository')
        private readonly repository: StatisticsRepository
    ) {
        DomainEventsImpl
            .getInstance()
            .on('SearchEvent', async (where: CandidateWhere) => {
                const record: StatisticsRecord = {
                    'experience': where.experience,
                    'education': where.degree,
                    'languages': where.languages.map(lang => lang.substr(0, 2).toUpperCase()),
                    'skills': where.skills,
                    'jobDetails': where.jobDetails,
                    'age': where.age.from.toString() + '-' + where.age.to.toString(),
                    'country': where.country
                };
                await this.repository.save(record);
            })
    }
}