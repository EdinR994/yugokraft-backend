import {InjectKnex, Knex} from 'nestjs-knex';
import {Injectable} from "@nestjs/common";
import {CandidateRepository} from "../domain/candidate.repository";
import {CandidateWhere} from "../domain/candidateWhere";
import {Status} from "../../core/status";
import {CandidateFactory} from "../domain/candidateFactory";
import {CandidateDoesntExistException} from "./candidateDoesntExistException";
import {CandidateEntity} from "../domain/candidateEntity";

@Injectable()
export class SqlCandidateRepository implements CandidateRepository {

    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {}

    async getById(id: string, employerId: string): Promise<CandidateEntity> {
        const [candidate, ...etc]: any[] = await this.knex('candidates')
            .select([
                'candidates.id',
                this.knex.raw(`jsonb_build_object(
                    'name', concat(candidates.username, ' ', candidates."lastName"),
                    'email', candidates.email
                ) as credentials`),
                'candidate_status.status as status'
            ])
            .join(this.knex.raw(`candidate_status ON candidate_status.candidate_id = candidates.id AND candidate_status.employer_id = ?`, employerId))
            .where('candidates.id', id);

        if(!candidate) {
            throw new CandidateDoesntExistException();
        }

        return CandidateFactory.create(
            candidate.id,
            candidate.credentials,
            Number(candidate.status)
        );
    }

    async getAll(where: CandidateWhere): Promise<any> {

        const { nameOrEmail, degree, experience, languages, skills, country, jobDetails, employerId, status, page, size, age, eu, showWithRequestedDocuments } = where;

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
            .select([
                'candidate_id',
                'status'
            ])
            .where({
                'employer_id': employerId
            })

        if(status.length) {
            candidateStatusQuery
                .whereIn('status', status.map(String))
        }

        if(!status.includes(Status.Open)) {
            candidateStatusQuery
                .where('status', '!=', Status.Open.toString())
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
            .groupBy('candidateId')

        if(showWithRequestedDocuments) {

            const fulfilledRequestQuery = this.knex('document_requests')
                .select([
                    this.knex.raw('candidate_id'),
                    this.knex.raw('COUNT(*) as total')
                ])
                .where({
                    fulfilled: showWithRequestedDocuments,
                    'employer_id': employerId
                })
                .groupBy('candidate_id');

            candidatesFullQuery
                .with('document_requests', fulfilledRequestQuery)
                .innerJoin(this.knex.raw('document_requests ON document_requests.candidate_id = candidates.id'))

        }

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

        candidatesFullQuery
            .with('countries', countriesQuery)
            .with('candidate_status', candidateStatusQuery)
            .with('jobs', jobsQuery)
            .with('educations', educationsQuery)
            .with('languages', languagesQuery)
            .with('skills', skillsQuery)
            .with('polls', pollsQuery)
            .with('candidates', candidatesQuery)
            .with('documents', documentsQuery)

        const [data, total, fulfilledRequests] = await Promise.all([
            candidatesFullQuery,
            this.countAll(where),
            this.countFulfilledDocumentRequests(employerId, status)
        ]);

        return {
            data,
            page,
            size: data.length,
            total,
            fulfilledRequests
        };

    }

    private async countAll(where: CandidateWhere) {

        const { nameOrEmail, degree, experience, languages, skills, country, jobDetails, employerId, status, page, size, age, eu, showWithRequestedDocuments } = where;

        const countCandidatesFullQuery = this.knex('candidates')
            .count()
            .join(this.knex.raw('countries ON countries.id = candidates."countryId"'))
            .join(this.knex.raw('candidate_status ON candidate_status.candidate_id = candidates.id'))
            .leftJoin(this.knex.raw('jobs ON jobs."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('educations ON educations."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('languages ON languages."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('skills ON skills."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('polls ON polls."candidateId" = candidates.id'))

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
            .select([
                'candidate_id'
            ])
            .where({
                'employer_id': employerId
            })

        if(status.length) {
            candidateStatusQuery
                .whereIn('status', status.map(String))
        }

        if(!status.includes(Status.Open)) {
            candidateStatusQuery
                .where('status', '!=', Status.Open.toString())
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

        if(showWithRequestedDocuments) {

            const fulfilledRequestQuery = this.knex('document_requests')
                .select([
                    'document_requests.candidate_id',
                    this.knex.raw('COUNT(DISTINCT document_requests.candidate_id) as total')
                ])
                .where({
                    fulfilled: showWithRequestedDocuments,
                    'document_requests.employer_id': employerId
                })
                .groupBy('candidate_id');

            countCandidatesFullQuery
                .with('document_requests', fulfilledRequestQuery)
                .innerJoin(this.knex.raw('document_requests ON document_requests.candidate_id = candidates.id'))

        }

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
            .with('candidates', candidatesQuery)

        const [{ count }] = await countCandidatesFullQuery;

        return Number(count);
    }

    private async countFulfilledDocumentRequests(employerId: string, status: Status[]) {
        const query = this.knex('document_requests')
            .countDistinct('document_requests.candidate_id')
            .join(this.knex.raw(`candidate_status 
                    ON candidate_status.candidate_id = document_requests.candidate_id
                    AND candidate_status.employer_id = ?`, [employerId]))
            .where({
                fulfilled: true,
                'document_requests.employer_id': employerId
            })

        if(!status.includes(Status.Open)) {
            query
                .where('status', '!=', Status.Open.toString())
        } else {
            query
                .where('status', '=', Status.Open.toString())
        }

        const [{ count }] = await query;
        return Number(count);
    }

    async updateStatus(candidateId: string, employerId: string, status: Status): Promise<boolean> {
        await this.knex('candidate_status')
            .update({ status })
            .where('candidate_id', candidateId)
            .andWhere('employer_id', employerId);
        return true;
    }

    async hireCandidate(candidateId: string): Promise<boolean> {
        await this.knex('candidate_status')
            .update({ status: Status.Hired })
            .where('candidate_id', candidateId)
        return true;
    }
}
