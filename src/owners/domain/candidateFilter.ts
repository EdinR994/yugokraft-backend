import {Status} from "../../core/status";

export interface CandidateFilter {
    nameOrEmail: string,
    degree: string[],
    detailed: boolean,
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
    page: number,
    size: number,
    status: [(Status.Open | Status.Hired)?, (Status.Hired | Status.Open)?]
}
