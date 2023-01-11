import {TemplateService} from "./template.service";
import { promises } from 'fs';
import { join } from 'path'
import * as handlebars from 'handlebars'

export class HbsTemplateService implements TemplateService {

    private constructor(private readonly path: string) {}

    static fromPath(path: string) {
        return new HbsTemplateService(path);
    }

    getTemplateByMailType(type: string, data: any): Promise<string> {
        return this.getHandler(type)(data)
    }

    private getHandler(type: string) {
        return this.handlers[type] || this.handlers["text"];
    };

    private readonly handlers: Record<string, (data: any) => Promise<string>> = {
        "text": (data: string) => Promise.resolve(data),
        "reset": async (data: any) => handlebars.compile(await this.getTemplate("reset"))(data),
        "invite": async (data: any) => handlebars.compile(await this.getTemplate("invite"))(data),
        "cvremind": async (data: any) => handlebars.compile(await this.getTemplate("cvremind"))(data),
        "approve": async (data: any) => handlebars.compile(await this.getTemplate("approve"))(data),
        "hired": async (data: any) => handlebars.compile(await this.getTemplate("hired"))(data),
        "rescheduling": async (data: any) => handlebars.compile(await this.getTemplate("rescheduling"))(data),
        "request": async (data: any) => handlebars.compile(await this.getTemplate("request"))(data),
        "accept": async (data: any) => handlebars.compile(await this.getTemplate("accept"))(data),
        "dayreminder": async (data: any) => handlebars.compile(await this.getTemplate("dayreminder"))(data),
        "halfanhourreminder": async (data: any) => handlebars.compile(await this.getTemplate("halfanhourreminder"))(data),
        "acceptcandidate": async (data: any) => handlebars.compile(await this.getTemplate("acceptcandidate"))(data),
        "upload": async (data: any) => handlebars.compile(await this.getTemplate("upload"))(data),
        "set": async (data: any) => handlebars.compile(await this.getTemplate("set"))(data)
    }

    private getTemplate(type: string) {
        return promises.readFile(join(this.path, `${type}.hbs`), { encoding: "utf-8" });
    };
}