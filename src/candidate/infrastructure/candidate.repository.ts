import {CandidateRepository} from "../domain/candidate.repository";
import {InjectKnex} from "nestjs-knex/index";
import Knex from "knex";
import {CandidateEntity} from "../domain/candidate.entity";
import {TokenDoesntExistException} from "./tokenDoesntExistException";
import {S3} from 'aws-sdk'
import {Inject, Logger, LoggerService} from "@nestjs/common";
import {CandidateDocument} from "../domain/candidateDocument";
import {CategoryDoesntExistException} from "./categoryDoesntExistException";
import * as AdmZip from "adm-zip";
import {RequestedDocument} from "../domain/requestedDocument";
import {join} from 'path';
import {CandidateDoesntExistException} from "./candidateDoesntExistException";
import { UpdateProfileDto } from "../api/updateProfile.dto";
import { CreateCandidateDto } from "../api/createCandidate.dto";
import { v4 as uuid } from "uuid";
import {doc} from "prettier";

export class SqlCandidateRepository implements CandidateRepository {

    constructor(
        @InjectKnex() private readonly knex: Knex,
        @Inject('S3') private readonly s3: S3,
        @Inject('LoggerService')
        private readonly logger: LoggerService
    ) {
    }

    async updateProfile({ candidateId, availableForCall, desiredRegion, desiredSpheres, educations, experienceAbroad, jobs, languages, motivation, skills, whenReadyToWork, havePreviouslyWorked }: UpdateProfileDto): Promise<void> {

        await this.knex.transaction(async (tx) => {
            this.logger.log(`Trying to update candidates 
                ${candidateId} ${availableForCall} ${desiredRegion} ${JSON.stringify(desiredSpheres)} 
                ${JSON.stringify(educations)}, ${experienceAbroad}, ${JSON.stringify(jobs)}, ${JSON.stringify(languages)},
                ${motivation}, ${JSON.stringify(skills)}, ${whenReadyToWork}, ${havePreviouslyWorked}
            `);
            await tx('candidates')
                .update({
                    'communications': desiredSpheres,
                    experienceAbroad,
                    'noJobExpierence': havePreviouslyWorked
                })
                .where('id', candidateId);

            this.logger.log(`Trying to delete polls`);
            await tx('polls')
                .delete()
                .where('candidateId', candidateId);

            this.logger.log(`Trying to update polls`);

            await tx('polls')
                .insert({
                    candidateId,
                    'whyYouWant': motivation,
                    'when': whenReadyToWork,
                    'region': desiredRegion,
                    'available': availableForCall
                });

            this.logger.log(`Trying to delete educations`);

            await tx('educations')
                .delete()
                .where('candidateId', candidateId);

            this.logger.log(`Trying to update educations`);

            for(const { degree, specialty } of educations) {
                await tx('educations')
                    .insert({
                        candidateId,
                        'educationRank': specialty,
                        'educationName': degree
                    });
            }

            this.logger.log(`Trying to delete jobs`);

            await tx('jobs')
                .delete()
                .where('candidateId', candidateId);

            this.logger.log(`Trying to update jobs`);

            for(const { position, company, from, present, responsibilities, specialization, to } of jobs) {
                await tx('jobs')
                    .insert({
                        candidateId,
                        position,
                        company,
                        from,
                        to,
                        'tillNow': present,
                        responsibilities,
                        'jobPathWay': specialization
                    });
            }

            this.logger.log(`Trying to delete languages`);

            await tx('languages')
                .delete()
                .where('candidateId', candidateId);

            this.logger.log(`Trying to update languages`);

            for(const { language, level} of languages) {
                await tx('languages')
                    .insert({
                        candidateId,
                        'languageName': language,
                        level
                    });
            }

            this.logger.log(`Trying to delete skills`);

            await tx('skills')
                .delete()
                .where('candidateId', candidateId);

            this.logger.log(`Trying to update skills`);

            for(const { name, description } of skills) {
                await tx('skills')
                    .insert({
                        candidateId,
                        'skillName': name,
                        description
                    });
            }

        });

    }

    async save({ id = uuid(), email, countryId, dateOfBirth, lastName, phoneNumber, username }: CreateCandidateDto): Promise<string> {

        const [duplicateWithEmailAndId] = await this.knex('candidates')
            .where({ email, id });

        if(duplicateWithEmailAndId) {
            await this.knex('candidates')
                .update({
                    countryId,
                    username,
                    lastName,
                    phoneNumber,
                    dateOfBirth
                })
                .where('id', id)
            return id;
        }

        const [duplicateWithId] = await this.knex('candidates')
            .where({ id });

        const [candidateId] = await this.knex('candidates')
            .insert({
                id: duplicateWithId
                    ? uuid()
                    : id,
                email,
                countryId,
                username,
                lastName,
                phoneNumber,
                dateOfBirth
            })
            .returning('candidates.id');

        return candidateId;
    }

    async getById(candidateId: string): Promise<CandidateEntity> {
        const [candidate, ...etc]: any[] = await this.knex('candidates')
            .select([
                'candidates.id',
                this.knex.raw(`CONCAT(username, ' ', "lastName") as name`),
                'email'
            ])
            .where('id', candidateId);

        if(!candidate) {
            throw new CandidateDoesntExistException()
        }

        return candidate;
    }

    async getExpired(period: number): Promise<CandidateEntity[]> {
        const candidates = this.knex('candidates')
            .select([
                'candidates.id',
                this.knex.raw(`CONCAT(username, ' ', "lastName") as name`),
                'email'
            ])
            .whereRaw(this.knex.raw(`date_trunc('day', last_activity)::date <= date_trunc('day', NOW() - CONCAT(?::text, ' ', 'days')::interval)::date`, [
                period.toString()
            ]))
            .groupBy('candidates.id');

        const data = await candidates;

        return data
            .map(({ name, email, id }) => new CandidateEntity(id, email, name));
    }

    async setExpired(token: string, expired: boolean): Promise<boolean> {

        const [data, ...etc] = await this.knex('tokens')
            .where('token', token)
            .andWhereRaw(this.knex.raw(`data->>'type' = 'expire'`));

        if(!data) {
            throw new TokenDoesntExistException();
        }

        const { candidateId } = data.data;

        await this.knex.transaction(async (tx) => {

            await tx('candidates')
                .update('expired', expired)
                .where('id', candidateId);

            await tx('tokens')
                .delete()
                .where('token', token);

            await tx('candidates')
                .update('last_activity', this.knex.raw('NOW()'))
                .where('id', candidateId);

        });

        return true;
    }

    async attachDocuments(candidateId: string, documents: CandidateDocument[]): Promise<boolean> {
        await this.knex.transaction(async (tx) => {
            for(const document of documents) {
                const [category] = await this.knex('document_categories')
                    .select('name')
                    .where('id', document.categoryId);
                if(!category) {
                    throw new CategoryDoesntExistException();
                }
                const name = document.filename + '_' + category.name.toLowerCase() + document.extname;
                const key = category.name.toLowerCase() + '/' + name;
                await this.s3.putObject({
                    Bucket: process.env.DIGITAL_OCEAN_S3_BUCKET_NAME,
                    ACL: process.env.ACL,
                    Key: key,
                    Body: document.buffer
                }).promise()
                await this.knex('documents')
                    .insert({
                        candidateId,
                        'category_id': document.categoryId,
                        name,
                        version: 2,
                        path: encodeURI(`https://${process.env.DIGITAL_OCEAN_S3_BUCKET_NAME}.${process.env.DIGITAL_OCEAN_ENDPOINT}/${key}`)
                    })
            }

            await tx('candidates')
                .update('expired', false)
                .where('id', candidateId);

            await tx('candidates')
                .update('last_activity', this.knex.raw('NOW()'))
                .where('id', candidateId);
        })

        return true;
    }

    async getDocuments(candidateId: string, categoryId: string): Promise<RequestedDocument> {

        const [category, ...etc] = await this.knex('document_categories')
            .select('name')
            .where('id', categoryId);

        if(!category) {
            throw new CategoryDoesntExistException();
        }

        const docs: any[] = await this.knex('documents')
            .select([
                'documents.name',
                'version',
                this.knex.raw(`"createdAt"::date::text as date`)
            ])
            .where('candidateId', candidateId)
            .andWhere('category_id', categoryId);

        const zip = new AdmZip();

        for(const { name, version, date } of docs) {
            const { Body } = await this.s3.getObject({
                Bucket: process.env.DIGITAL_OCEAN_S3_BUCKET_NAME,
                Key: version === 1
                    ? 'upload' + '/' + name.replace("_" + date.replace(/-/gm, "_") + "_other", "")
                    : category.name.toLowerCase() + '/' + name
            }).promise()
            zip.addFile(name, Body as Buffer);
        }

        return RequestedDocument.fabricMethod("yug_documents.zip", category.name, zip.toBuffer());
    }

    async getAllDocuments(candidateId: string): Promise<RequestedDocument> {

        const docs: any[] = await this.knex('documents')
            .select([
                'documents.name',
                'version',
                'document_categories.name as category',
                this.knex.raw(`"createdAt"::date::text as date`)
            ])
            .join(this.knex.raw('document_categories ON document_categories.id = documents.category_id'))
            .where('candidateId', candidateId)

        const zip = new AdmZip();

        for(const { name, version, category, date } of docs) {
            const { Body } = await this.s3.getObject({
                Bucket: process.env.DIGITAL_OCEAN_S3_BUCKET_NAME,
                Key: version === 1
                    ? 'upload' + '/' + name.replace("_" + date.replace(/-/gm, "_") + "_other", "")
                    : category.toLowerCase() + '/' + name
            }).promise()
            zip.addFile(join(category, name), Body as Buffer);
        }

        return RequestedDocument.fabricMethod("yug_documents.zip", 'all', zip.toBuffer());

    }

    async getAgeRange(): Promise<any> {
        const result = await this.knex.raw(`select min(age) minAge, max(age) maxAge from candidates`);
        if (result && result.rows) {
            return {
                minAge: result.rows[0].minage,
                maxAge: result.rows[0].maxage,
            };
        }

        return {
            minAge: 0,
            maxAge: 100,
        };
    }

}
