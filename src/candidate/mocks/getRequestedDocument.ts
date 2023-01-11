import {RequestedDocument} from "../domain/requestedDocument";

export const getRequestedDocument = (filename = 'file.txt', category = 'other') => RequestedDocument.fabricMethod(
    filename,
    category,
    Buffer.from(filename + category, 'utf-8')
)