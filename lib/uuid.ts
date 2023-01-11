import {Guid} from "../src/core/guid";
import { v4 as uuid } from 'uuid';

export class UUIDV4 implements Guid {
    next() {
        return uuid();
    }
}