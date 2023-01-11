import {CandidateDocument} from "../domain/candidateDocument";

export const getCandidateDocument = (filename = 'file.txt', category = 'other') => CandidateDocument.fabricMethod({
    filename,
    buffer: Buffer.from(filename + category, 'utf-8'),
    categoryId: 'id'
})