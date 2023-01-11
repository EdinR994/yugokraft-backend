import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import {CandidateController} from "./api/candidate.controller";
import {CandidateEvents} from "./api/candidate.events";
import {SqlCandidateRepository} from "./infrastructure/candidate.repository";
import {DomainEventsImpl} from "../../lib/domainEvents.impl";
import * as AWS from 'aws-sdk';
import {CandidateServiceImpl} from "./domain/candidate.service.impl";
import {SqlDocumentRepository} from "./infrastructure/document.repository";
import {ClockModule} from "../clock/clock.module";
import {SqlEmployerRepository} from "./infrastructure/employer.repository";
import {SqlTokenRepository} from "./infrastructure/token.repository";
import {SqlReadModelRepository} from "./infrastructure/readModel.repository";
import {Translator} from "./api/translator";
import {GoogleTranslator} from "./api/translator.impl";
import {v2} from '@google-cloud/translate'
import {LoggerModule} from "../logger/logger.module";

@Module({
    imports: [
        AuthModule,
        ClockModule,
        LoggerModule
    ],
    providers: [
        {
            provide: 'DomainEvents',
            useValue: DomainEventsImpl
                .getInstance()
        },
        {
          provide: 'DomainCandidateRepository',
          useClass: SqlCandidateRepository
        },
        {
          provide: 'DomainDocumentRepository',
          useClass: SqlDocumentRepository
        },
        {
            provide: 'S3',
            useFactory: () => new AWS.S3({
                endpoint: process.env.DIGITAL_OCEAN_ENDPOINT,
                accessKeyId: process.env.DIGITAL_OCEAN_ACCESS_KEY_ID,
                secretAccessKey: process.env.DIGITAL_OCEAN_SECRET_ACCESS_KEY,
                region: process.env.DIGITAL_OCEAN_REGION
            })
        },
        {
            provide: 'DomainCandidateService',
            useClass: CandidateServiceImpl
        },
        {
            provide: 'EmployerRepository',
            useClass: SqlEmployerRepository
        },
        {
            provide: 'CandidateTokenRepository',
            useClass: SqlTokenRepository
        },
        {
            provide: 'ReadModelRepository',
            useClass: SqlReadModelRepository
        },
        {
            provide: 'GoogleTranslator',
            useFactory: () => {
                return new v2.Translate({ projectId: process.env.GOOGLE_PROJECT_ID })
            }
        },
        {
            provide: 'Translator',
            useClass: GoogleTranslator
        },
        CandidateEvents
    ],
    controllers: [
        CandidateController
    ]
})
export class CandidateModule {}
