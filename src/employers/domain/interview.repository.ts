import {InterviewEntity} from "./interview.entity";
import {InterviewTime} from "./interviewTime";

export interface InterviewRepository {
    getInterviewIdByToken(token: string): Promise<string>;
    deleteInterviewToken(token: string): Promise<boolean>;
    save(interviews: Array<InterviewEntity>): Promise<boolean>;
    getById(interviewId: string): Promise<InterviewEntity>;
    acquireDate(calendarId: string, interviewId: string, time: InterviewTime): Promise<boolean>;
    deleteInterviews(candidateId: string): Promise<boolean>;
    updateData<T>(interviewId: string, data: T): Promise<boolean>;
}