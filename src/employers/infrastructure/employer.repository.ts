import { InjectKnex, Knex } from 'nestjs-knex';
import {EmployerRepository} from "../domain/employer.repository";
import {EmployerAggregate} from "../domain/employer.entity";
import {EmployerCredentials} from "../domain/employerCredentials";
import {Inject, Injectable} from "@nestjs/common";
import {DuplicateEmailException} from "./duplicateEmailException";
import {CredentialsDoesntExistsException} from "./credentialsDoesntExistsException";
import {EmployerDoesntExistException} from "./employerDoesntExistException";
import {CalendarEntity} from "../domain/calendar.entity";
import {CalendarInterval} from "../domain/calendarInterval";
import {InterviewEntity} from "../domain/interview.entity";
import {InterviewTime} from "../domain/interviewTime";
import {PreferredTime} from "../domain/preferredTime";
import {Status} from "../../core/status";
import {CalendarTime} from "../domain/calendarTime";

@Injectable()
export class SqlEmployerRepository implements EmployerRepository {

    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {}

    async getById(employerId: string): Promise<EmployerAggregate> {
        const [data, ...etc] = await this.knex('employers')
            .select(this.knex.raw(`
                employers.id,
                employers.name,
                employers.email,
                employers.company,
                coalesce(calendars.json, '[]'::jsonb) as calendars,
                coalesce(interviews.json, '[]'::jsonb) as interviews
            `))
            .leftJoin(this.knex.raw(`
                (
                    SELECT
                        calendars.employer_id, 
                        jsonb_agg(jsonb_build_object(
                            'calendar', to_jsonb(calendars),
                            'timeList', coalesce(calendar_preferred_time.json, '[]'::jsonb)
                        )) as json FROM calendars
                    LEFT JOIN (
                        SELECT
                            calendar_id,
                            jsonb_agg(to_jsonb(calendar_preferred_time)) as json
                        FROM calendar_preferred_time
                        GROUP BY calendar_id
                    ) calendar_preferred_time ON calendar_preferred_time.calendar_id = calendars.id
                    GROUP BY employer_id
                ) calendars ON calendars.employer_id = employers.id
            `))
            .leftJoin(this.knex.raw(`
                (
                    SELECT
                        interviews.employer_id,
                        jsonb_agg(jsonb_build_object(
                            'from', substring(interviews.from::text, 1, 5),
                            'to', substring(interviews.to::text, 1, 5),
                            'date', date,
                            'id', interviews.id,
                            'calendar_id', interviews.calendar_id,
                            'employer_id', employer_id,
                            'candidate_id', candidate_id
                        )) as json FROM interviews
                    GROUP BY interviews.employer_id
                ) interviews ON interviews.employer_id = employers.id
            `))
            .where('employers.id', employerId)
            .groupBy(1, 2, 3, 4, 5, 6);

        if(!data) {
            throw new EmployerDoesntExistException();
        }

        const { id, name, email, company, calendars, interviews } = data;

        return new EmployerAggregate(
            id,
            {
                name,
                email,
                company
            },
            calendars.map(({ timeList, calendar }) =>
                new CalendarEntity(
                    calendar.id,
                    calendar['employer_id'],
                    CalendarInterval.create(new Date(calendar.start), new Date(calendar.end)),
                    calendar['exempt_holidays'],
                    calendar['interview_duration'],
                    timeList.map(({ from, to }) => new PreferredTime(
                        CalendarTime.create(from.substring(0, 5)),
                        CalendarTime.create(to.substring(0, 5))
                    )),
                    interviews
                        .filter((interview) => interview['calendar_id'] === calendar.id)
                        .map((interview) => {
                            const date = new Date(interview['date']);
                            const from = CalendarTime.create(interview['from']);
                            const to = CalendarTime.create(interview['to']);
                            return new InterviewEntity(
                                interview.id,
                                interview['employer_id'],
                                interview['candidate_id'],
                                InterviewTime.create(date, new PreferredTime(from, to ))
                            )
                        })
                )
            )
        );
    }

    async save(entity: EmployerAggregate): Promise<boolean> {
        const { name, email, company }: EmployerCredentials = (<any>entity).credentials;

        const [duplicate] = await this.knex('employers')
            .where({ email });

        const [duplicateOwner] = await this.knex('owners')
            .where({ email });

        if(duplicate || duplicateOwner) {
            throw new DuplicateEmailException();
        }

        await this.knex('employers')
            .insert({
                id: entity.id,
                name,
                email,
                company
            });
        return true;
    }

    async getCredentials(employerId: string): Promise<EmployerCredentials> {
        const [credentials, ...etc]  = await this.knex('employers')
            .select([
                'email',
                'company',
                'name'
            ])
            .where('id', employerId);

        if(!credentials) {
            throw new CredentialsDoesntExistsException();
        }

        return credentials;
    }

    getEmployerListWhereCandidateIsPendingOrHavingInterview(employerId: string, candidateId: string): Promise<Array<EmployerCredentials>> {
        return this.knex('employers')
            .distinct('employers.id')
            .select([
                'name',
                'email',
                'company'
            ])
            .leftJoin(this.knex.raw('candidate_status ON candidate_status.employer_id = employers.id'))
            .leftJoin(this.knex.raw('interviews ON interviews.employer_id = employers.id'))
            .where('employers.id', '!=', employerId)
            .andWhere('active', true)
            .andWhere('candidate_status.status', '=', Status.Open.toString())
            .andWhere('candidate_status.candidate_id', '=', candidateId)
            .orWhere('interviews.candidate_id', candidateId);
    }

}