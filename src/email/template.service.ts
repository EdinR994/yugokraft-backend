export interface TemplateService {
    getTemplateByMailType(type: string, data: any): Promise<string>;
}