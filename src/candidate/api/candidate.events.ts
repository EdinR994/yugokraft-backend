import {Inject} from "@nestjs/common";
import {DomainEvents} from "../../core/domainEvents";
import {DomainEventsImpl} from "../../../lib/domainEvents.impl";
import {ExpiredCVEventData} from "../../owners/domain/expiredCV.event";
import {CandidateRepository} from "../domain/candidate.repository";
import {NewMailEvent} from "../../email/newMail.event";
import {TokenRepository} from "../../auth/domain/token.repository";
import {Clock} from "../../core/clock";
import {RenewalPeriod} from "../../owners/domain/renewalPeriod";
import {RequestDocumentEventData} from "../domain/requestDocument.event";
import {ExpiredCandidateEvent, ExpiredCandidateEventData} from "../domain/expiredCandidate.event";
import {UploadDocumentsEventData} from "../domain/uploadDocuments.event";

export class CandidateEvents {
    constructor(
        @Inject('DomainEvents')
        private readonly events: DomainEvents,
        @Inject('DomainCandidateRepository')
        private readonly candidateRepository: CandidateRepository,
        @Inject('TokenRepository')
        private readonly tokenRepository: TokenRepository,
        @Inject('ClockService')
        private readonly clock: Clock
    ) {
        DomainEventsImpl
            .getInstance()
            .on('ExpiredCandidateEvent', async ({ token }: ExpiredCandidateEventData) => {
                await this.candidateRepository.setExpired(token, true);
            })
            .on('ExpiredCVEvent', async ({ period }: ExpiredCVEventData) => {

                const candidates = await this.candidateRepository.getExpired(period.value);

                for(const { id, email, name } of candidates) {

                    const token = await this.tokenRepository.createToken({ candidateId: id, type: 'expire' });

                    this.clock.setHandler({
                        timeout: new RenewalPeriod(RenewalPeriod.min).value,
                        type: "day",
                        repeat: false,
                        key: token,
                        event: new ExpiredCandidateEvent({
                            token
                        })
                    });

                    this.events.push(new NewMailEvent({
                        type: 'cvremind',
                        recipient: email,
                        data: {
                            userName: name,
                            confirmLink: `${process.env.HOST_WEB}/confirm?token=${token}`
                        }
                    }));

                }

            })
            .on('RequestDocumentEvent', async ({ candidate, categories, employerId, requestId, note }: RequestDocumentEventData) => {
                const token = await this.tokenRepository.createToken({ id: candidate.id, type: 'request', employerId, requestId });
                this.events.push(new NewMailEvent({
                    type: 'request',
                    recipient: candidate.email,
                    data: {
                        userName: candidate.name,
                        requestData: categories,
                        uploadLink: `${process.env.HOST_WEB}/upload?token=${token}`,
                        employerComment: note.length
                            ? note
                            : null
                    }
                }))
            })
            .on('UploadDocumentsEvent', ({ employer, candidate }: UploadDocumentsEventData) => {
                this.events.push(new NewMailEvent({
                    type: 'upload',
                    recipient: employer.email,
                    data: {
                        userName: employer.name,
                        candidateLink: `${process.env.HOST}/candidates_list`,
                        candidate: candidate.name,
                        candidateEmail: candidate.email
                    }
                }))
            })
    }
}
