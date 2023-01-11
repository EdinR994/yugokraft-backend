import {InterviewTime} from "./interviewTime";

export interface AcquireDateForInterviewData {
    token: string,
    time: InterviewTime,
    offset?: number
}