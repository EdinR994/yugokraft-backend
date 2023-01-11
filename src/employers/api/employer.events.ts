import {DomainEventsImpl} from "../../../lib/domainEvents.impl";
import {Inject} from "@nestjs/common";
import {InterviewRepository} from "../domain/interview.repository";
import {PushedInterviewEventData} from "../domain/pushedInterview.event";
import {NewInterviewEventData} from "../domain/newInterview.event";
import {DomainEvents} from "../../core/domainEvents";
import {CandidateRepository} from "../domain/candidate.repository";
import {NewEmployerEventData} from "../domain/newEmployer.event";
import {NewUserEvent} from "../../auth/domain/newUser.event";
import {NewMailEvent} from "../../email/newMail.event";
import {ResolvedCandidateEventData} from "../domain/resolvedCandidate.event";
import {Status} from "../../core/status";
import {DeletedCalendarEventData} from "../domain/deletedCalendar.event";
import {sign} from 'jsonwebtoken'
import {randomBytes} from "crypto";
import {Clock} from "../../core/clock";
import {TokenRepository} from "../../auth/domain/token.repository";
import {InterviewHasEndedEvent, InterviewHasEndedEventData} from "../domain/interviewHasEnded.event";
import * as ics from 'ics';
import { EventAttributes } from 'ics';
import {CalendarTime} from "../domain/calendarTime";

export class EmployerEvents {
    constructor(
        @Inject('InterviewRepository')
        private readonly interviewRepository: InterviewRepository,
        @Inject('DomainEvents')
        private readonly events: DomainEvents,
        @Inject('CandidateRepository')
        private readonly candidateRepository: CandidateRepository,
        @Inject('ClockService')
        private readonly clocks: Clock,
        @Inject('TokenRepository')
        private readonly tokenRepository: TokenRepository
    ) {
        DomainEventsImpl
            .getInstance()
            .on('NewInterviewEvent', async ({ interview, candidateId, candidateCredentials, employerId }: NewInterviewEventData) => {
                const calendarToken = await this.tokenRepository.createToken({ id: interview.id, employerId, candidateId });
                this.events.push(new NewMailEvent({
                    recipient: candidateCredentials.email,
                    type: "invite",
                    data: {
                        userName: candidateCredentials.name,
                        chooseDate: `${process.env.HOST_WEB}/calendar?token=${calendarToken}`
                    }
                }))
            })
            .on('PushedInterviewEvent', async ({ candidateId, candidateCredentials, employerCredentials, employerId, interviewId, time, offset }: PushedInterviewEventData) => {
                const roomTime = `${time.date.toDateString()} at ${time.time.from.toString().split(":")[0]} ${time.time.from.toString().split(":")[1]}`;
                const room = `${employerCredentials.company} interview with ${candidateCredentials.name} on ${roomTime}`;
                const employerToken = sign({
                    room,
                    name: employerCredentials.name
                }, randomBytes(8));
                const employerJitsiLink = `${process.env.HOST}/interview?token=${employerToken}`;
                const candidateToken = sign({ room, name: candidateCredentials.name }, randomBytes(8));
                const candidateJitsiLink = `${process.env.HOST}/interview?token=${candidateToken}`;
                const event: Partial<EventAttributes> = {
                    title: `${candidateCredentials.name} interview with ${employerCredentials.company}`,
                    status: "CONFIRMED",
                    organizer: { name: employerCredentials.name, email: employerCredentials.email },
                    attendees: [ { name: candidateCredentials.name, email: candidateCredentials.email } ]
                }
                const candidateEvent = await ics.createEvent({
                    ...event,
                    start: [time.date.getFullYear(), time.date.getMonth() + 1, time.date.getDate(), time.time.from.getHours(), time.time.from.getMinutes()],
                    end: [time.date.getFullYear(), time.date.getMonth() + 1, time.date.getDate(), time.time.to.getHours(), time.time.to.getMinutes()],
                    url: candidateJitsiLink
                });
                const employerEvent = await ics.createEvent({
                    ...event,
                    start: [time.date.getFullYear(), time.date.getMonth() + 1, time.date.getDate(), time.time.from.getHours() - offset, time.time.from.getMinutes()],
                    end: [time.date.getFullYear(), time.date.getMonth() + 1, time.date.getDate(), time.time.to.getHours(), time.time.to.getMinutes()],
                    url: employerJitsiLink
                });
                const candidateInterviewTime = CalendarTime.create(time.time.from.toString(), false, -offset).toString();
                await this.interviewRepository.updateData(interviewId, { jitsiLink: employerJitsiLink })
                this.events
                    .push(new NewMailEvent({
                        recipient: employerCredentials.email,
                        type: "accept",
                        data: {
                            userName: employerCredentials.name,
                            candidate: candidateCredentials.name,
                            interviewDate: time.date.toISOString().split("T")[0],
                            interviewTime: time.time.from.toString(),
                            jitsiLink: employerJitsiLink
                        },
                        attachments: [{
                            name: 'event.ics',
                            data: Buffer.from(employerEvent.value)
                        }]
                    }))
                    .push(new NewMailEvent({
                        recipient: candidateCredentials.email,
                        type: "acceptcandidate",
                        data: {
                            userName: candidateCredentials.name,
                            company: employerCredentials.company,
                            interviewDate: time.date.toISOString().split("T")[0],
                            interviewTime: candidateInterviewTime,
                            jitsiLink: candidateJitsiLink
                        },
                        attachments: [{
                            name: 'event.ics',
                            data: Buffer.from(candidateEvent.value)
                        }]
                    }));
                this.clocks
                    .setHandler({
                        timeout: Math.floor(time.leftToDayBefore()/Clock.Day),
                        type: "day",
                        key: interviewId + 'dayBefore',
                        repeat: false,
                        event: new NewMailEvent({
                            recipient: candidateCredentials.email,
                            type: "dayreminder",
                            data: {
                                userName: candidateCredentials.name,
                                interviewDate: time.date.toISOString().split("T")[0],
                                interviewTime: candidateInterviewTime,
                                jitsiLink: candidateJitsiLink
                            }
                        })
                    })
                    .setHandler({
                        timeout: Math.floor(time.leftToHalfAnHourBefore()/Clock.Minute),
                        type: "minute",
                        key: interviewId + 'halfAnHourBefore',
                        repeat: false,
                        event: new NewMailEvent({
                            recipient: candidateCredentials.email,
                            type: "halfanhourreminder",
                            data: {
                                userName: candidateCredentials.name,
                                interviewTime: candidateInterviewTime,
                                jitsiLink: candidateJitsiLink
                            }
                        })
                    })
                    .setHandler({
                        timeout: Math.floor(time.leftToEnd()/Clock.Minute),
                        type: "minute",
                        key: interviewId + 'end',
                        repeat: false,
                        event: new InterviewHasEndedEvent({ candidateId, employerId })
                    });
            })
            .on('InterviewHasEndedEvent', async ({ candidateId, employerId }: InterviewHasEndedEventData) => {
                await this.candidateRepository.updateStatus(candidateId, employerId, Status.Open)
            })
            .on('NewEmployerEvent', async ({ id, credentials }: NewEmployerEventData) => {
                this.events.push(new NewUserEvent({ id, role: 'employer', recipient: credentials.email, data: { userName: credentials.name } }))
            })
            .on('ResolvedCandidateEvent', async ({ resolvedStatus, credentials }: ResolvedCandidateEventData) => {
                if(resolvedStatus === Status.Hired) {
                    const events = credentials
                        .map(({ email, name }) => new NewMailEvent({
                            recipient: email,
                            data: {
                                userName: name
                            },
                            type: "hired"
                        }))
                    events.forEach((event) => this.events.push(event));
                }
            })
            .on('DeletedCalendarEvent', async ({ attachedInterviews }: DeletedCalendarEventData) => {
                for(const interview of attachedInterviews) {
                    const calendarToken = await this.tokenRepository.createToken({ id: interview.id, employerId: interview.employerId, candidateId: interview.candidateId });
                    this.clocks.resetHandler(interview.id + 'dayBefore');
                    this.clocks.resetHandler(interview.id + 'halfAnHourBefore');
                    const candidate = await this.candidateRepository.getById(interview.candidateId, interview.employerId);
                    const credentials = candidate.getCredentials();
                    this.events.push(new NewMailEvent({
                        type: "rescheduling",
                        recipient: credentials.email,
                        data: {
                            userName: credentials.name,
                            reschedulingLink: `${process.env.HOST_WEB}/calendar?token=${calendarToken}`
                        },
                    }))
                }
            })
    }
}