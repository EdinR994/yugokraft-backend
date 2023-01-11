import {Inject, Injectable} from "@nestjs/common";
import {OwnerRepository} from "./owner.repository";
import {OwnerService} from "./owner.service";
import {EmployerRepository} from "./employer.repository";
import {DomainEvents} from "../../core/domainEvents";
import {ActiveStatusUpdateEvent} from "./activeStatusUpdate.event";
import {EmployerFilter} from "./employerFilter";
import {CandidateFilter} from "./candidateFilter";
import {CandidateRepository} from "./candidate.repository";
import {RenewalPeriod} from "./renewalPeriod";
import {NewOwnerEvent} from "./newOwner.event";
import {Clock, ClockOptions} from "../../core/clock";
import {ExpiredCVEvent, ExpiredCVEventData} from "./expiredCV.event";

@Injectable()
export class OwnerServiceImpl implements OwnerService {

    constructor(
        @Inject('OwnerRepository')
        private readonly ownerRepository: OwnerRepository,
        @Inject('EmployerRepository')
        private readonly employerRepository: EmployerRepository,
        @Inject('DomainEvents')
        private readonly events: DomainEvents,
        @Inject('CandidateRepository')
        private readonly candidateRepository: CandidateRepository,
        @Inject('ClockService')
        private readonly clock: Clock
    ) {}

    private setRenewalClock(renewalPeriod = new RenewalPeriod()) {
        const options: ClockOptions<ExpiredCVEventData> = {
            timeout: renewalPeriod.value,
            type: "day",
            repeat: true,
            key: 'OwnerClock',
            event: new ExpiredCVEvent({ period: renewalPeriod })
        };
        this.clock.setHandler(options);
    }

    async createOwner(email: string): Promise<boolean> {
        const id = await this.ownerRepository.save(email);
        this.events.push(new NewOwnerEvent({ id, email }));
        return true;
    }

    getAllEmployers(filter: EmployerFilter): Promise<any> {
        return this.employerRepository.getAll(filter);
    }

    async setActiveStatusForEmployer(employerId: string, active: boolean): Promise<boolean> {
        const employer = await this.employerRepository.getById(employerId);
        await this.employerRepository.updateActiveStatus(employerId, active);
        this.events.push(new ActiveStatusUpdateEvent({ employer, active }));
        return true;
    }

    getAllCandidates(filter: CandidateFilter): Promise<any> {
        return this.candidateRepository.getAll(filter);
    }

    async updateRenewalPeriod(renewalPeriod: RenewalPeriod): Promise<boolean> {
        await this.ownerRepository.updateRenewalPeriod(renewalPeriod.value);
        this.setRenewalClock(renewalPeriod);
        return true;
    }

    getRenewalPeriod(): Promise<RenewalPeriod> {
        return this.ownerRepository.getRenewalPeriod();
    }

}