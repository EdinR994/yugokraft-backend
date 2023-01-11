import {Status} from "../../core/status";

export interface CandidateWhere {
    nameOrEmail?: string,
    employerId: string,
    degree: string[],
    showWithRequestedDocuments: boolean,
    experience: string[],
    languages: string[],
    skills: string[],
    jobDetails: string[],
    age: {
        from: number,
        to: number
    },
    country: string[],
    eu: boolean,
    status: Array<Status>,
    page: number,
    size: number
}
