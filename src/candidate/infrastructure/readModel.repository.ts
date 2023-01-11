import {Injectable} from "@nestjs/common";
import {InjectKnex} from "nestjs-knex/index";
import Knex from "knex";
import {ReadModelRepository} from "../api/readModel.repository";

@Injectable()
export class SqlReadModelRepository implements ReadModelRepository {

    constructor(
        @InjectKnex() private readonly knex: Knex,
    ) {}

    async getCandidateById(id: string, employerId: string): Promise<any> {

        const candidateFullQuery = this.knex('candidates')
            .select([
                'candidates.id as id',
                'candidates.createdAt',
                this.knex.raw(`
                        jsonb_build_object(
                            'candidate', candidates.data,
                            'country', countries.data,
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
            .leftJoin(this.knex.raw('jobs ON jobs."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('educations ON educations."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('languages ON languages."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('skills ON skills."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('polls ON polls."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('documents ON documents."candidateId" = candidates.id'))
            .orderBy('candidates.createdAt', 'DESC')
            .where('candidates.id', id);

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
            .groupBy('candidateId')

        const candidatesQuery = this.knex('candidates')
            .select([
                "id",
                "countryId",
                "createdAt",
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

        candidateFullQuery
            .with('countries', countriesQuery)
            .with('jobs', jobsQuery)
            .with('educations', educationsQuery)
            .with('languages', languagesQuery)
            .with('skills', skillsQuery)
            .with('polls', pollsQuery)
            .with('documents', documentsQuery)
            .with('candidates', candidatesQuery)

        const [candidate, ...etc] = await candidateFullQuery;

        return candidate

    }

}