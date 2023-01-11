import {DomainEventsImpl} from "../../../lib/domainEvents.impl";
import {TokenRepository} from "../domain/token.repository";
import {Inject, Injectable} from "@nestjs/common";
import {ResetPasswordEventData} from "../domain/resetPasswordEvent";
import {AuthRepository} from "../domain/auth.repository";
import {DomainEvents} from "../../core/domainEvents";
import {NewMailEvent} from "../../email/newMail.event";
import {NewUserEventData} from "../domain/newUser.event";

@Injectable()
export class AuthEvents {
    constructor(
        @Inject('TokenRepository')
        private readonly tokenRepository: TokenRepository,
        @Inject('AuthRepository')
        private readonly authRepository: AuthRepository,
        @Inject('DomainEvents')
        private readonly events: DomainEvents
    ) {
        DomainEventsImpl
            .getInstance()
            .on('ResetPasswordEvent', async ({ email }: ResetPasswordEventData) => {
                const { id, role, name } = await this.authRepository.getByEmail(email) as any;
                const token = await this.tokenRepository.createToken({ id, role });
                return this.events.push(new NewMailEvent({
                    type: "reset",
                    recipient: email,
                    data: {
                        userName: name,
                        resetLink: `${process.env.HOST}/registration?token=${token}`,
                        unsubscribeLink: ""
                    }
                }))
            })
            .on('NewUserEvent', async ({ recipient, data, id, role }: NewUserEventData<any>) => {
                const token = await this.tokenRepository.createToken({ id, role });
                return this.events.push(new NewMailEvent({
                    type: "set",
                    recipient,
                    data: {
                        ...data,
                        resetLink: `${process.env.HOST}/registration?token=${token}`,
                        unsubscribeLink: ""
                    }
                }))
            })
    }
}