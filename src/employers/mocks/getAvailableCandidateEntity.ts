import {AvailableCandidateEntity} from "../domain/availableCandidate.entity";
import {Status} from "../../core/status";

export const getAvailableCandidateEntity = (status = Status.Available) => new AvailableCandidateEntity(
    'id',
    {
        name: 'name',
        email: 'name@example.com'
    },
    status
)