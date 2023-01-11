import {Inject} from "@nestjs/common";
import {DomainEvents} from "../../core/domainEvents";
import {DomainEventsImpl} from "../../../lib/domainEvents.impl";
import {NewUserEvent} from "../../auth/domain/newUser.event";
import {NewOwnerEventData} from "../../owners/domain/newOwner.event";
import {ActiveStatusUpdateEventData} from "../domain/activeStatusUpdate.event";
import {NewMailEvent} from "../../email/newMail.event";

export class OwnerEvents {
    constructor(
        @Inject('DomainEvents')
        private readonly events: DomainEvents
    ) {
        DomainEventsImpl
            .getInstance()
            .on('ActiveStatusUpdateEvent', ({ active, employer }: ActiveStatusUpdateEventData) => {
                if(active) {
                    this.events.push(new NewMailEvent({
                        recipient: employer.email,
                        data: {
                            userName: employer.name,
                            loginPage: `${process.env.HOST}/login`
                        },
                        type: "approve"
                    }))
                }
            })
            .on('NewOwnerEvent', ({ email, id }: NewOwnerEventData) => {
                this.events.push(new NewUserEvent({ recipient: email, data: { userName: email }, role: 'owner', id }));
            })
    }
}