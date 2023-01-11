import {InterviewRepository} from "../domain/interview.repository";
import {Injectable} from "@nestjs/common";
import {InjectKnex} from "nestjs-knex/index";
import Knex from "knex";
import {InterviewEntity} from "../domain/interview.entity";
import {InterviewDoesntExistException} from "./interviewDoesntExistException";
import {TimeDoesntExistException} from "./timeDoesntExistException";
import {InterviewTime} from "../domain/interviewTime";
import {TokenDoesntExistException} from "./tokenDoesntExist.exception";

@Injectable()
export class SqlInterviewRepository implements InterviewRepository {

    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {}

    updateData<T>(interviewId: string, data: T): Promise<boolean> {
        return this.knex('interviews')
            .update({ data })
            .where('id', interviewId)
            .then(() => true);
    }

    async acquireDate(calendarId: string, interviewId: string, preferredTime: InterviewTime): Promise<boolean> {

        const { date, time } = preferredTime;
        const { from, to } = time;


        const [timeRow, ...etc] = await this.knex('calendar_preferred_time')
            .select('id')
            .where('calendar_id', calendarId)
            .andWhere('from', '<=' , `${from.getHours()}:${from.getMinutes()}:00`)
            .andWhere('to', '>=', `${to.getHours()}:${to.getMinutes()}:00`)

        if(!timeRow) {
            throw new TimeDoesntExistException();
        }

        const [{ candidate_id: candidateId }] = await this.knex('interviews')
            .select([
                'candidate_id'
            ])
            .where('id', interviewId);

        await this.knex('interviews')
            .update({
                'date': date,
                'calendar_id': calendarId,
                'from': from.toString(),
                'to': to.toString()
            })
            .where('id', interviewId);

        await this.knex('candidates')
            .update('expired', false)
            .where('id', candidateId);

        await this.knex('candidates')
            .update('last_activity', this.knex.raw('NOW()'))
            .where('id', candidateId);

        return true;
    }

    async getById(interviewId: string): Promise<InterviewEntity> {
        const [interview, ...etc] = await this.knex('interviews')
            .where('id', interviewId);

        if(!interview) {
            throw new InterviewDoesntExistException();
        }

        return new InterviewEntity(
            interview['id'],
            interview['employer_id'],
            interview['candidate_id'],
            interview['date']
        )
    }

    async deleteInterviews(candidateId: string): Promise<boolean> {
        return this.knex('interviews')
            .delete()
            .where('candidate_id', candidateId)
            .then(() => true);
    }

    async save(interviews: Array<InterviewEntity>): Promise<boolean> {
        await this.knex('interviews')
            .insert(interviews.map((interview: any) => ({
                'id': interview.id,
                'employer_id': interview.employerId,
                'candidate_id': interview.candidateId,
                'date': interview.date
            })));
        return true;
    }

    async getInterviewIdByToken(token: string): Promise<string> {
        const [data, ...etc] = await this.knex('tokens')
            .where('token', token);
        if(!data) {
            throw new TokenDoesntExistException();
        }
        return data.data.id;
    }

    async deleteInterviewToken(token: string): Promise<boolean> {
        await this.knex('tokens')
            .delete()
            .where('token', token);
        return true
    }


}