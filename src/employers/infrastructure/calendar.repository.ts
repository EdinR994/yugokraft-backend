import { InjectKnex, Knex  } from 'nestjs-knex';
import {Injectable} from "@nestjs/common";
import {CalendarRepository} from "../domain/calendar.repository";
import {CalendarEntity} from "../domain/calendar.entity";
import {TokenDoesntExistException} from "./tokenDoesntExist.exception";

@Injectable()
export class SqlCalendarRepository implements CalendarRepository {

    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {}


    private get interviewQuery() {

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
                        'present', jobs."tillNow" IS NULL,
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

        const candidatesQuery = this.knex('candidates')
            .select([
                "id",
                'age',
                'username',
                'lastName',
                'email',
                'countryId',
                this.knex.raw(`
                    jsonb_build_object(
                        'id', candidates.id,
                        'experienceAbroad', candidates."experienceAbroad",
                        'phoneNumber', candidates."phoneNumber",
                        'birthdate', candidates."dateOfBirth",
                        'desiredWorkSpheres', candidates.communications,
                        'havePreviouslyWorked', candidates."noJobExpierence"
                    ) as data
                `)
            ])

        const interviewQuery = this.knex('interviews')
            .with('countries', countriesQuery)
            .with('jobs', jobsQuery)
            .with('educations', educationsQuery)
            .with('languages', languagesQuery)
            .with('skills', skillsQuery)
            .with('polls', pollsQuery)
            .with('candidates', candidatesQuery)
            .select([
                'interviews.calendar_id',
                this.knex.raw(`
                    jsonb_agg(jsonb_build_object(
                        'from', interviews.from,
                        'to', interviews.to,
                        'date', interviews.date,
                        'data', interviews.data,
                        'age', candidates.age,
                        'candidate', candidates.data,
                        'name', concat(candidates.username, ' ', candidates."lastName"),
                        'email', candidates.email,
                        'country', countries.data,
                        'jobs', COALESCE(jobs.data, '[]'::jsonb),
                        'educations', COALESCE(educations.data, '[]'::jsonb),
                        'languages', COALESCE(languages.data, '[]'::jsonb),
                        'skills', COALESCE(skills.data, '[]'::jsonb),
                        'polls', COALESCE(polls.data, '[]'::jsonb)
                    )) as json
                `)
            ])
            .innerJoin(this.knex.raw('candidates ON candidates.id = interviews.candidate_id'))
            .innerJoin(this.knex.raw('calendars ON calendars.id = interviews.calendar_id'))
            .innerJoin(this.knex.raw('countries ON countries.id = candidates."countryId"'))
            .leftJoin(this.knex.raw('jobs ON jobs."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('educations ON educations."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('languages ON languages."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('skills ON skills."candidateId" = candidates.id'))
            .leftJoin(this.knex.raw('polls ON polls."candidateId" = candidates.id'))
            .groupBy('interviews.calendar_id');

        return interviewQuery;

    }

    async getAll(employerId: string): Promise<any> {

        const calendarsPreferredTimeQuery = this.knex('calendar_preferred_time')
            .select([
                'calendar_id',
                this.knex.raw(`
                    jsonb_agg(jsonb_build_object(
                        'from', substring(calendar_preferred_time.from::text, 1, 5),
                        'to', substring(calendar_preferred_time.to::text, 1, 5)
                    )) as json
                `)
            ])
            .groupBy('calendar_id')

        const [data] = await this.knex('calendars')
            .with('calendar_preferred_time', calendarsPreferredTimeQuery)
            .with('interviews', this.interviewQuery)
            .select(this.knex.raw(
                `
                jsonb_agg(jsonb_build_object(
                    'id', calendars.id,
                    'start', calendars.start,
                    'end', calendars.end,
                    'interviewDuration', calendars.interview_duration,
                    'exemptHolidays', calendars.exempt_holidays,
                    'preferredTimeList', coalesce(calendar_preferred_time.json, '[]'::jsonb),
                    'interviews', coalesce(interviews.json, '[]'::jsonb)
                )) as data
                `
            ))
            .leftJoin(this.knex.raw('calendar_preferred_time ON calendars.id = calendar_preferred_time.calendar_id'))
            .leftJoin(this.knex.raw(`interviews ON calendars.id = interviews.calendar_id`))
            .where('employer_id', employerId);
        const { data: calendars } = data as any;
        return calendars || [];
    }

    async save(entity: CalendarEntity): Promise<boolean> {

        const { id, employerId, interval, preferredTimeList, exemptHolidays, interviewDuration } =  entity as any;
        const { start, end } = interval as any;

        await this.knex.transaction(async (trx) => {

            await trx('calendars')
                .insert({
                    id,
                    start,
                    end,
                    'employer_id': employerId,
                    'exempt_holidays': exemptHolidays,
                    'interview_duration': interviewDuration
                })

            await trx('calendar_preferred_time')
                .insert(preferredTimeList.map(({ from, to }) => ({ from: from.time, to: to.time, 'calendar_id': id })))

        })

        return true;

    }

    deleteEmployerCalendar(employerId: string, calendarId: string): Promise<boolean> {
        return this.knex('calendars')
            .delete()
            .where('employer_id', employerId)
            .andWhere('id', calendarId)
            .then(_ => true);
    }

     async getCalendarsByToken(token: string, timezone = 'Europe/Berlin'): Promise<any> {

        const [data, ...etc] = await this.knex('tokens')
            .where('token', token);

        if(!data) {
            throw new TokenDoesntExistException();
        }

        const { employerId } = data.data;

        const preferredTimeQuery = this.knex('calendar_preferred_time')
            .select([
                'calendar_id',
                this.knex.raw(`
                    jsonb_agg(jsonb_build_object(
                        'from', substring((calendar_preferred_time.from AT TIME ZONE ?::text)::text, 1, 5),
                        'to', substring((calendar_preferred_time.to AT TIME ZONE ?::text)::text, 1, 5)
                    )) as data
                `, [timezone, timezone])
            ])
            .groupBy('calendar_id');

        const availableDatesQuery = this.knex('calendars')
            .select([
                'employer_id',
                this.knex.raw(`
                    jsonb_agg(jsonb_build_object(
                        'start', calendars.start,
                        'end', calendars.end,
                        'duration', calendars.interview_duration,
                        'time', preferred_time.data
                    )) as data
                `)
            ])
            .leftJoin(this.knex.raw('preferred_time ON preferred_time.calendar_id = calendars.id'))
            .groupBy('employer_id');

        const acquiredDatesQuery = this.knex('interviews')
            .select([
                'employer_id',
                this.knex.raw(`
                      jsonb_agg(jsonb_build_object(
                        'from', substring((interviews.from AT TIME ZONE ?::text)::text, 1, 5),
                        'to', substring((interviews.to AT TIME ZONE ?::text)::text, 1, 5),
                        'date', interviews.date
                      )) as data
                `, [timezone, timezone])
            ])
            .whereNotNull('calendar_id')
            .groupBy('employer_id');

        const calendarListQuery = this.knex('employers')
            .with('preferred_time', preferredTimeQuery)
            .with('available_dates', availableDatesQuery)
            .with('acquired_dates', acquiredDatesQuery)
            .select([
                'name',
                this.knex.raw(`coalesce(available_dates.data, '[]'::jsonb) as available`),
                this.knex.raw(`coalesce(acquired_dates.data, '[]'::jsonb) as acquired`)
            ])
            .innerJoin(this.knex.raw('available_dates ON available_dates.employer_id = employers.id'))
            .leftJoin(this.knex.raw('acquired_dates ON acquired_dates.employer_id = employers.id'))
            .where('employers.id', employerId)
            .groupBy(['name', 'available_dates.data', 'acquired_dates.data'])

         return calendarListQuery;

    }

}