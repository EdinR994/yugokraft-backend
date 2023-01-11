import {CandidateRepository} from "../domain/candidate.repository";
import {CandidateFilter} from "../../owners/domain/candidateFilter";
import {InjectKnex} from "nestjs-knex/index";
import Knex from "knex";
import {Status} from "../../core/status";
import {Inject, LoggerService} from "@nestjs/common";

export class SqlCandidateRepository implements CandidateRepository {

    constructor(
        @InjectKnex() private readonly knex: Knex,
        @Inject('LoggerService')
        private readonly logger: LoggerService
    ) {}

    private async countAll(filter: CandidateFilter) {

        const { nameOrEmail, degree, experience, languages, skills, country, jobDetails, status, page, size, age, eu, detailed } = filter;

        const countCandidatesFullQuery = this.knex('candidates')
            .count()
            .join(this.knex.raw('countries ON countries.id = candidates."countryId"'))
            .join(this.knex.raw('candidate_status ON candidate_status.candidate_id = candidates.id'))
            .leftJoin(this.knex.raw('jobs ON jobs."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('educations ON educations."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('languages ON languages."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('skills ON skills."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('polls ON polls."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('documents ON documents."candidateId" = candidates.id'));

        if(detailed) {
            countCandidatesFullQuery
                .whereNotNull('documents.id_list')
        }

        if(experience.length) {
            countCandidatesFullQuery
                .whereNotNull('jobs.id_list')
        }

        if(degree.length) {
            countCandidatesFullQuery
                .whereNotNull('educations.id_list')
        }

        if(languages.length) {
            countCandidatesFullQuery
                .whereNotNull('languages.id_list')
        }

        if(skills.length) {
            countCandidatesFullQuery
                .whereNotNull('skills.id_list')
        }

        const countriesQuery = this.knex('countries')
            .select([
                'id'
            ])

        if(eu !== undefined) {
            countriesQuery
                .where({
                    eu
                })
        }

        if(country.length) {
            countriesQuery
                .whereIn('name', country)
        }

        const candidateStatusQuery = this.knex('candidate_status')
            .distinctOn([
                'candidate_id'
            ])

        if(status.length) {
            candidateStatusQuery
                .whereIn('status', status.map(String))
        } else {
            candidateStatusQuery
                .whereIn('status', [Status.Hired, Status.Open].map(String))
        }

        const jobsQuery = this.knex('jobs')
            .select([
                'candidateId',
                this.knex.raw('array_agg(id) as id_list')
            ])
            .groupBy('candidateId')

        if(experience.length) {
            jobsQuery
                .whereIn('jobPathWay', experience)
        }

        const educationsQuery = this.knex('educations')
            .select([
                'candidateId',
                this.knex.raw('array_agg(id) as id_list')
            ])
            .groupBy('candidateId');

        if(degree.length) {
            educationsQuery
                .whereIn('educationName', degree)
        }

        const languagesQuery = this.knex('languages')
            .select([
                'candidateId',
                this.knex.raw('array_agg(id) as id_list')
            ])
            .groupBy('candidateId');

        if(languages.length) {
            languagesQuery
                .whereIn('languageName', languages)
        }

        const skillsQuery = this.knex('skills')
            .select([
                'candidateId',
                this.knex.raw('array_agg(id) as id_list')
            ])
            .groupBy('candidateId');

        if(skills.length) {
            skillsQuery
                .whereIn('skillName', skills)
        }

        const pollsQuery = this.knex('polls')
            .select([
                'candidateId'
            ])
            .groupBy('candidateId');

        const documentsQuery = this.knex('documents')
            .select([
                'candidateId',
                this.knex.raw('array_agg(documents.id) as id_list')
            ])
            .join(this.knex.raw('document_categories ON documents.category_id = document_categories.id'))
            .groupBy('candidateId');

        const candidatesQuery = this.knex('candidates')
            .select([
                "id",
                "countryId"
            ])
            .where('age', '>=', age.from ?? 0)
            .andWhere('age', '<=', age.to ?? 100)
            .andWhere('expired', '=', false)

        if(nameOrEmail && nameOrEmail.trim().length) {
            candidatesQuery.andWhereRaw(`
            candidates.username ILIKE CONCAT('%', ?::text, '%')
             OR candidates."lastName" ILIKE CONCAT('%', ?::text, '%')
             OR candidates.email ILIKE CONCAT('%', ?::text, '%')`,
                [nameOrEmail, nameOrEmail, nameOrEmail])
        }

        if(jobDetails.length) {
            candidatesQuery
                .andWhereRaw(this.knex.raw(`array_to_string(communications, '') ILIKE CONCAT('%', ?::text, '%')`, jobDetails.join("")))
        }

        countCandidatesFullQuery
            .with('countries', countriesQuery)
            .with('candidate_status', candidateStatusQuery)
            .with('jobs', jobsQuery)
            .with('educations', educationsQuery)
            .with('languages', languagesQuery)
            .with('skills', skillsQuery)
            .with('polls', pollsQuery)
            .with('documents', documentsQuery)
            .with('candidates', candidatesQuery)

        const [{ count }] = await countCandidatesFullQuery;

        return Number(count);
    }

    async getAll(filter: CandidateFilter): Promise<any> {

        this.logger.log(`Trying to find all candidates by filter ${JSON.stringify(filter)}`);

        const { nameOrEmail, degree, experience, languages, skills, country, jobDetails, status, page, size, age, eu, detailed } = filter;

        const candidatesFullQuery = this.knex('candidates')
            .select([
                'candidates.id as id',
                'candidates.updatedAt',
                this.knex.raw(`
                        jsonb_build_object(
                            'candidate', candidates.data,
                            'country', countries.data,
                            'status', candidate_status.status::integer,
                            'jobs', COALESCE(jobs.data, '[]'::jsonb),
                            'educations', COALESCE(educations.data, '[]'::jsonb),
                            'languages', COALESCE(languages.data, '[]'::jsonb),
                            'skills', COALESCE(skills.data, '[]'::jsonb),
                            'polls', COALESCE(polls.data, '[]'::jsonb),
                            'documents', COALESCE(documents.data, '[]'::jsonb)
                        ) as data
                    `)
            ])
            .join(this.knex.raw('countries ON countries.id = candidates."countryId"'))
            .join(this.knex.raw('candidate_status ON candidate_status.candidate_id = candidates.id'))
            .leftJoin(this.knex.raw('jobs ON jobs."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('educations ON educations."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('languages ON languages."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('skills ON skills."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('polls ON polls."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('documents ON documents."candidateId" = candidates.id'))
            .orderBy('candidates.updatedAt', 'DESC')
            .limit(size ?? 10)
            .offset((page ?? 0) * (size ?? 10))

        if(detailed) {
            candidatesFullQuery
                .whereNotNull('documents.candidateId')
        }

        if(experience.length) {
            candidatesFullQuery
                .whereNotNull('jobs.data')
        }

        if(degree.length) {
            candidatesFullQuery
                .whereNotNull('educations.data')
        }

        if(languages.length) {
            candidatesFullQuery
                .whereNotNull('languages.data')
        }

        if(skills.length) {
            candidatesFullQuery
                .whereNotNull('skills.data')
        }

        const countriesQuery = this.knex('countries')
            .select([
                'id',
                this.knex.raw(`
                    jsonb_build_object(
                        'name', name,
                        'eu', eu
                    ) as data
                `)
            ])

        if(eu !== undefined) {
            countriesQuery
                .where({
                    eu
                })
        }

        if(country.length) {
            countriesQuery
                .whereIn('name', country)
        }

        const candidateStatusQuery = this.knex('candidate_status')
            .distinctOn([
                'candidate_id',
                'status'
            ])

        if(status.length) {
            candidateStatusQuery
                .whereIn('status', status.map(String))
        } else {
            candidateStatusQuery
                .whereIn('status', [Status.Hired, Status.Open].map(String))
        }

        const jobsQuery = this.knex('jobs')
            .select([
                'candidateId',
                this.knex.raw(`
                    jsonb_agg(jsonb_build_object(
                        'position', jobs.position,
                        'company', jobs.company,
                        'responsibilities', jobs.responsibilities,
                        'present', jobs."tillNow",
                        'period', date_part('year', age(jobs.to, jobs.from)),
                        'from', jobs.from,
                        'to', jobs.to,
                        'specialization', jobs."jobPathWay"
                    )) as data
                `)
            ])
            .groupBy('candidateId')

        if(experience.length) {
            jobsQuery
                .whereIn('jobPathWay', experience)
        }

        const educationsQuery = this.knex('educations')
            .select([
                'candidateId',
                this.knex.raw(`
                    jsonb_agg(jsonb_build_object(
                        'degree', educations."educationName",
                        'specialty', educations."educationRank"
                    )) as data
                `)
            ])
            .groupBy('candidateId');

        if(degree.length) {
            educationsQuery
                .whereIn('educationName', degree)
        }

        const languagesQuery = this.knex('languages')
            .select([
                'candidateId',
                this.knex.raw(`
                    jsonb_agg(jsonb_build_object(
                        'language', upper(substring(languages."languageName", 1, 2)),
                        'level', languages.level
                    )) as data
                `)
            ])
            .groupBy('candidateId');

        if(languages.length) {
            languagesQuery
                .whereIn('languageName', languages)
        }

        const skillsQuery = this.knex('skills')
            .select([
                'candidateId',
                this.knex.raw(`
                    jsonb_agg(jsonb_build_object(
                        'name', skills."skillName",
                        'description', COALESCE(skills.description, '')
                    )) as data
                `)
            ])
            .groupBy('candidateId');

        if(skills.length) {
            skillsQuery
                .whereIn('skillName', skills)
        }

        const pollsQuery = this.knex('polls')
            .select([
                'candidateId',
                this.knex.raw(`
                    jsonb_agg(jsonb_build_object(
                        'motivation', polls."whyYouWant",
                        'availableForCall', polls."available",
                        'whenReadyToWork', polls."when",
                        'desiredRegion', polls.region
                    )) as data
                `)
            ])
            .groupBy('candidateId');

        const documentsQuery = this.knex('documents')
            .select([
                this.knex.raw(`jsonb_agg(DISTINCT jsonb_build_object(
                    'category', document_categories.name
                )) as data`),
                'candidateId',
            ])
            .innerJoin(this.knex.raw('document_categories ON document_categories.id = documents.category_id'))
            .groupBy('candidateId');

        const candidatesQuery = this.knex('candidates')
            .select([
                "id",
                "countryId",
                "updatedAt",
                this.knex.raw(`
                    jsonb_build_object(
                        'firstName', candidates.username,
                        'experienceAbroad', candidates."experienceAbroad",
                        'lastName', candidates."lastName",
                        'phoneNumber', candidates."phoneNumber",
                        'age', candidates.age,
                        'birthdate', candidates."dateOfBirth",
                        'desiredWorkSpheres', candidates.communications,
                        'email', candidates.email,
                        'havePreviouslyWorked', candidates."noJobExpierence"
                    ) as data
                `)
            ])
            .where('age', '>=', age.from ?? 0)
            .andWhere('age', '<=', age.to ?? 100)
            .andWhere('expired', '=', false);

        if(nameOrEmail && nameOrEmail.trim().length) {
            candidatesQuery.andWhereRaw(`
            candidates.username ILIKE CONCAT('%', ?::text, '%')
             OR candidates."lastName" ILIKE CONCAT('%', ?::text, '%')
             OR candidates.email ILIKE CONCAT('%', ?::text, '%')`,
                [nameOrEmail, nameOrEmail, nameOrEmail])
        }

        if(jobDetails.length) {
            candidatesQuery
                .andWhereRaw(this.knex.raw(`array_to_string(communications, '') ILIKE CONCAT('%', ?::text, '%')`, jobDetails.join("")));
        }

        candidatesFullQuery
            .with('countries', countriesQuery)
            .with('candidate_status', candidateStatusQuery)
            .with('jobs', jobsQuery)
            .with('educations', educationsQuery)
            .with('languages', languagesQuery)
            .with('skills', skillsQuery)
            .with('polls', pollsQuery)
            .with('documents', documentsQuery)
            .with('candidates', candidatesQuery)

        this.logger.log(`Query: ${candidatesFullQuery.toSQL().toNative().sql.toString()}`);

        const [data, total] = await Promise.all([
            candidatesFullQuery,
            this.countAll(filter)
        ]);

        this.logger.log(`Query res: ${JSON.stringify(data)}`);
        return {
            data,
            page,
            size: data.length,
            total
        };

    }

}
