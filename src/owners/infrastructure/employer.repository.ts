import {EmployerRepository} from "../domain/employer.repository";
import {InjectKnex} from "nestjs-knex/index";
import Knex from "knex";
import {EmployerFilter} from "../domain/employerFilter";
import {Status} from "../../core/status";
import {EmployerEntity} from "../domain/employer.entity";
import {EmployerDoesntExistException} from "./employerDoesntExistException";
import {Logger} from "@nestjs/common";

export class SqlEmployerRepository implements EmployerRepository {
    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {}

    updateActiveStatus(employerId: string, active: boolean) {
        return this.knex('employers')
            .update({
                active
            })
            .where('id', employerId)
            .then(() => true)
    }

    async getAll(employerFilter: EmployerFilter): Promise<any> {

        const { page, size } = employerFilter;

        const employersQuery = this.knex('employers')
            .with('hired', this.knex('employers')
                .select([
                    'employers.id as employer_id',
                    this.knex.raw('COUNT(candidate_status.id) as total ')
                ])
                .leftJoin(this.knex.raw(`candidate_status ON employers.id = employer_id AND status = ?::text`, [Status.Hired.toString()]))
                .groupBy('employers.id')
            )
            .with('interviewed', this.knex('employers')
                .select([
                    'employers.id as employer_id',
                    this.knex.raw('COUNT(candidate_status.id) as total ')
                ])
                .leftJoin(this.knex.raw(`candidate_status ON employers.id = employer_id AND status IN (?::text, ?::text, ?::text)`, [
                    Status.Hired.toString(),
                    Status.DidntShowUp.toString(),
                    Status.Rejected.toString()
                ]))
                .groupBy('employers.id')
            )
            .select([
                'employers.id',
                'name',
                'company',
                'email',
                'active',
                this.knex.raw('created_at as "createdAt"'),
                this.knex.raw('COALESCE(hired.total::integer, 0) as hired'),
                this.knex.raw('COALESCE(interviewed.total::integer, 0) as interviewed')
            ])
            .limit(size || 10)
            .offset((size || 10) * (page || 0))
            .orderBy('employers.created_at', 'DESC');

        this.applyEmployerFilter(employersQuery, employerFilter);

        const data = await employersQuery;

        const total = await this.countAll(employerFilter);

        const {hiredCandidatesCount, interviewedCandidatesCount} = await this.countInterviewedAndHiredCandidates()

        return {
            data,
            size: data.length,
            page,
            total,
            candidatesInterviewedCount: interviewedCandidatesCount,
            candidatesHiredCount: hiredCandidatesCount
        }

    }

    private async countAll(employerFilter: EmployerFilter): Promise<number> {

        const countQuery = this.knex('employers')
            .with('hired', this.knex('employers')
                .select([
                    'employers.id as employer_id',
                    this.knex.raw('COUNT(candidate_status.id) as total ')
                ])
                .leftJoin(this.knex.raw(`candidate_status ON employers.id = employer_id AND status = ?::text`, [Status.Hired.toString()]))
                .groupBy('employers.id')
            )
            .with('interviewed', this.knex('employers')
                .select([
                    'employers.id as employer_id',
                    this.knex.raw('COUNT(candidate_status.id) as total ')
                ])
                .leftJoin(this.knex.raw(`candidate_status ON employers.id = employer_id AND status IN (?::text, ?::text, ?::text)`, [
                    Status.Hired.toString(),
                    Status.DidntShowUp.toString(),
                    Status.Rejected.toString()
                ]))
                .groupBy('employers.id')
            )
            .count()

        this.applyEmployerFilter(countQuery, employerFilter);

        const [{count}] = await countQuery;

        return Number(count);

    }

    private applyEmployerFilter(query: Knex.QueryBuilder, { registrationDate, onlyActive, hired, interviewed, nameOrCompany }: EmployerFilter) {

        query
            .innerJoin(this.knex.raw(`hired ON hired.employer_id = employers.id AND hired.total BETWEEN ?::integer AND ?::integer`, [
                hired ? hired.from : 0,
                hired ? hired.to : 1000
            ]))
            .innerJoin(this.knex.raw(`interviewed ON interviewed.employer_id = employers.id AND interviewed.total BETWEEN ?::integer AND ?::integer`, [
                interviewed ? interviewed.from : 0,
                interviewed ? interviewed.to : 1000
            ]))

        if(onlyActive) {
            query
                .where('active', true)
        }

        if(registrationDate) {
            query
                .andWhereRaw(this.knex.raw('created_at::date BETWEEN ?::date AND ?::date', [registrationDate.from, registrationDate.to]))
        }

        if(nameOrCompany) {
            query
                .andWhereRaw(`employers.name ILIKE CONCAT('%', ?::text, '%') OR employers.company ILIKE CONCAT('%', ?::text, '%')`, [nameOrCompany, nameOrCompany])
        }

    }

    async getById(id: string): Promise<EmployerEntity> {
        const [employer, ...etc] = await this.knex('employers')
            .where('id', id);

        if(!employer) {
            throw new EmployerDoesntExistException();
        }

        return new EmployerEntity(
            employer.id,
            employer.email,
            employer.name
        )
    }

    private async countInterviewedAndHiredCandidates() {
        const result = await this.knex.raw(` select max(c) mc from (
	                                    select count(candidate_id ) as c, status, employer_id 
	                                    from candidate_status cs group by status, employer_id 
                                    ) maxHired
                                    where status = ? 

                                UNION ALL
                                    select max(sc) mc from (
                                        select sum(c) sc, employer_id 
                                        from (
                                            select c, employer_id 
                                            from (
                                                select count(candidate_id ) as c, status, employer_id 
                                                from candidate_status cs group by status, employer_id 
                                            ) countInterviewed
                                            where status = any (?)
                                        ) countInterviewedFiltered
                                        group by employer_id
                                    ) maxInterviewed
        `, [
            Status.Hired.toString(),
            [Status.Hired.toString(), Status.Rejected.toString(), Status.DidntShowUp.toString()]
        ]);

        if (result && result.rows && result.rows.length === 2) {
            return {
                hiredCandidatesCount: result.rows[0].mc,
                interviewedCandidatesCount: result.rows[1].mc,
            };
        }

        return {
            hiredCandidatesCount: 100,
            interviewedCandidatesCount: 100,
        }
    }

}
