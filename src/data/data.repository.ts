import {Injectable} from "@nestjs/common";
import Knex from "knex";
import {InjectKnex} from "nestjs-knex/index";

@Injectable()
export class DataRepository {

    constructor(
        @InjectKnex()
        private readonly knex: Knex
    ) {}

    getCountryList() {
        return this.knex('countries');
    }

    getCategoryList() {
        return this.knex('document_categories');
    }

}