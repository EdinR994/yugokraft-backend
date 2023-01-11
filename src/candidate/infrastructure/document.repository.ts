import {DocumentRepository} from "../domain/document.repository";
import {InjectKnex} from "nestjs-knex/index";
import Knex from "knex";

export class SqlDocumentRepository implements DocumentRepository {
    constructor(
        @InjectKnex() private readonly knex: Knex,
    ) {}

    async getCategoriesInIdList(idList: string[]): Promise<string[]> {
        const list = await this.knex('document_categories')
            .select('name')
            .whereIn('id', idList);

        return list
            .map(({ name }) => ({ name: name.replace(/([a-z])([A-Z])/g, '$1 $2') }))
            .map(({ name }) => name === 'CVTranslated In German Or English' ? 'CV Translated In German Or English' : name);
    }

    async fulfillRequest(requestId: string): Promise<boolean> {
        await this.knex('document_requests')
            .update({
                'fulfilled': true
            })
            .where('id', requestId);
        return true;
    }

    async saveRequest(candidateId: string, employerId: string): Promise<string> {
        const [id, ...etc] = await this.knex('document_requests')
            .insert({
                'candidate_id': candidateId,
                'employer_id': employerId
            })
            .returning('document_requests.id');
        return id;
    }

}