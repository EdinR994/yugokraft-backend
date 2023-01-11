import {Translator} from "./translator";
import {v2} from '@google-cloud/translate';
import {Inject} from "@nestjs/common";

export class GoogleTranslator implements Translator {

    constructor(
        @Inject('GoogleTranslator')
        private readonly translator: v2.Translate
    ) {}

    private async getTranslation(text: string | null) {
        return text ? (await this.translator.translate(text, 'DE'))[0] : text
    }

    async translateCandidate<T>(data: any): Promise<T> {
        return {
            ...data,
            candidate: {
                ...data.candidate,
                firstName: await this.getTranslation(data.candidate.firstName),
                lastName: await this.getTranslation(data.candidate.lastName),
                experienceAbroad: await this.getTranslation(data.candidate.experienceAbroad)
            },
            jobs: await Promise.all(data.jobs.map(async job => ({
                ...job,
                position: await this.getTranslation(job.position),
                responsibilities: await this.getTranslation(job.responsibilities)
            }))),
            polls: await Promise.all(data.polls.map(async poll => ({
                ...poll,
                motivation: await this.getTranslation(poll.motivation)
            }))),
            skills: await Promise.all(data.skills.map(async skill => ({
                ...skill,
                description: await this.getTranslation(skill.description)
            }))),
            educations: await Promise.all(data.educations.map(async education => ({
                ...education,
                specialty: await this.getTranslation(education.specialty)
            })))
        };
    }

}