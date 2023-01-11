import {getRequestedDocument} from "../mocks/getRequestedDocument";
import {basename, extname} from "path"
import {getUnderscoreDate} from "../mocks/getUnderscoreDate";

describe('RequestedDocument', () => {

    test('Requested document name should include filename', () => {
        const document = getRequestedDocument();
        const filename = basename("file.txt", ".txt");
        expect(document.filename.includes(filename)).toBe(true);
    })

    test('Requested document name should include current date formatted with underscore', () => {
        const document = getRequestedDocument();
        const date = getUnderscoreDate();
        expect(document.filename.includes(date)).toBe(true);
    })

    test('Requested document name should include category', () => {
        const document = getRequestedDocument();
        const category = "other";
        expect(document.filename.includes(category)).toBe(true);
    })

    test('Requested document name should include extension', () => {
        const document = getRequestedDocument();
        const extension = extname("file.txt");;
        expect(document.filename.includes(extension)).toBe(true);
    })

})