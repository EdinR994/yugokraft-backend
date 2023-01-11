import {randomBytes} from "crypto";
import {basename, extname} from "path";

export class RequestedDocument {

    private constructor(
        public readonly filename: string,
        public readonly buffer: Buffer
    ) {}

    private static getFilenameDate() {
        return new Date().toISOString().split("T")[0].replace(/-/gm, "_");
    }

    private static getRandomInteger() {
        return Math.abs(randomBytes(4).readInt32BE(0) - 1);
    }

    static fabricMethod(originalname: string, category: string, buffer: Buffer) {
        const ext = extname(originalname);
        const filename = [
            basename(originalname, ext),
            RequestedDocument.getFilenameDate(),
            RequestedDocument.getRandomInteger(),
            category.toLowerCase()
        ].join("_")
        return new RequestedDocument(filename + ext, buffer);
    }

}