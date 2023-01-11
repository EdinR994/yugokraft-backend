import {DomainEvent} from "../../core/domainEvent";

export interface ResetPasswordEventData {
    email: string
}

export class ResetPasswordEvent implements DomainEvent<ResetPasswordEventData> {
    public readonly name = 'ResetPasswordEvent'
    constructor(public readonly data: ResetPasswordEventData) {
    }
}