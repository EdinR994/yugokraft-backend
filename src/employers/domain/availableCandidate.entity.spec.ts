import {getAvailableCandidateEntity} from "../mocks/getAvailableCandidateEntity";
import {Status} from "../../core/status";
import {InvalidStatusException} from "./invalidStatusException";
import {AvailableCandidateEntity} from "./availableCandidate.entity";
import {PendingCandidateEntity} from "./pendingCandidate.entity";

describe("AvailableCandidateEntity", () => {

    test('If candidate has invited status, isInvited will return true', () => {
        const candidate = getAvailableCandidateEntity(Status.Invited);
        expect(candidate.isInvited()).toBe(true);
    })

    test('If candidate dont have invited status, isInvited will return false', () => {
        const candidate = getAvailableCandidateEntity(Status.Available);
        expect(candidate.isInvited()).toBe(false);
    })

    test('If candidate has confirmed status, isInvited will return true', () => {
        const candidate = getAvailableCandidateEntity(Status.Confirmed);
        expect(candidate.isConfirmed()).toBe(true);
    })

    test('If candidate dont have confirmed status, isInvited will return false', () => {
        const candidate = getAvailableCandidateEntity();
        expect(candidate.isConfirmed()).toBe(false);
    })

    test("If candidate dont belong to pending, he cant be hired", () => {
        const candidate = getAvailableCandidateEntity();
        expect(() => candidate.updateStatus(Status.Hired)).toThrow(new InvalidStatusException(Status.Hired));
    })

    test("If candidate dont belong to pending, he cant be rejected", () => {
        const candidate = getAvailableCandidateEntity();
        expect(() => candidate.updateStatus(Status.Rejected)).toThrow(new InvalidStatusException(Status.Rejected));
    })

    test("If candidate dont belong to pending, he cant be set as didnt show up", () => {
        const candidate = getAvailableCandidateEntity();
        expect(() => candidate.updateStatus(Status.DidntShowUp)).toThrow(new InvalidStatusException(Status.DidntShowUp));
    })

    test("If candidate status set to Open, pending candidate should be returned", () => {
        const candidate = getAvailableCandidateEntity();
        expect(candidate.updateStatus(Status.Open) instanceof PendingCandidateEntity).toBe(true);
    })

})