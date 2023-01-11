import {InvalidPeriodArgumentException} from "./invalidPeriodArgumentException";

export class RenewalPeriod {

    public static default = 14;

    public static min = 5;

    constructor(
        public readonly value: number = RenewalPeriod.default
    ) {
        if(value < RenewalPeriod.min) {
            throw new InvalidPeriodArgumentException();
        }
    }

}