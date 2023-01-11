import { basename, extname } from 'path'
import {CreateDocument} from "./createDocument";
import {randomBytes} from "crypto";

export class CandidateDocument {

    private constructor(
        public readonly filename: string,
        public readonly extname: string,
        public readonly buffer: Buffer,
        public readonly categoryId: string
    ) {}

    private static getFilenameDate() {
        return new Date().toISOString().split("T")[0].replace(/-/gm, "_");
    }

    private static getRandomInteger() {
        return Math.abs(randomBytes(4).readInt32BE(0) - 1);
    }

    static fabricMethod({ filename: originalname, categoryId, buffer }: CreateDocument) {
        const ext = extname(originalname);
        const filename = [
            basename(originalname, ext),
            CandidateDocument.getFilenameDate(),
            CandidateDocument.getRandomInteger()
        ].join("_")
        return new CandidateDocument(filename, ext, buffer, categoryId);
    }

}