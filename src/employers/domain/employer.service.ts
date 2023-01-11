import {EmployerCredentials} from "./employerCredentials";
import {CreateCalendarData} from "./createCalendarData";
import {AcquireDateForInterviewData} from "./acquireDateForInterviewData";
import {Status} from "../../core/status";

export interface EmployerService {
    createEmployer(credentials: EmployerCredentials): Promise<boolean>;
    createCalendar(data: CreateCalendarData): Promise<boolean>;
    inviteForInterview(employerId: string, candidateId: string): Promise<boolean>;
    acquireDateForInterview(data: AcquireDateForInterviewData): Promise<boolean>;
    deleteEmployerCalendar(employerId: string, calendarId: string): Promise<boolean>;
    resolveCandidate(employerId: string, candidateId: string, resolvingStatus: Status)
}