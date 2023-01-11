import {getCandidateDocument} from "../mocks/getCandidateDocument";
import {basename, extname} from "path";
import {getUnderscoreDate} from "../mocks/getUnderscoreDate";

describe("CandidateDocument", () => {

    test('Candidate document name should include filename', () => {
        const document = getCandidateDocument();
        const filename = basename("file.txt", ".txt");
        expect(document.filename.includes(filename)).toBe(true);
    })

    test('Requested document name should include current date formatted with underscore', () => {
        const document = getCandidateDocument();
        const date = getUnderscoreDate();
        expect(document.filename.includes(date)).toBe(true);
    })

    test('Requested document extension should be the extension of original file', () => {
        const document = getCandidateDocument();
        const extension = extname("file.txt");
        expect(document.extname === extension).toBe(true);
    })

})