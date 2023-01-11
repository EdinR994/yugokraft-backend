import {Status} from "../../core/status";

export class InvalidStatusException extends Error {
    constructor(status: Status) {
        super(`Got invalid status: ${status}`);
    }
}