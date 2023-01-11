import {Inject, LoggerService} from "@nestjs/common";
import {DomainEventsImpl} from "../../lib/domainEvents.impl";
import Mail from "nodemailer/lib/mailer";
import {NewMailEventData} from "./newMail.event";
import {TemplateService} from "./template.service";

export class EmailEvents {

    constructor(
        @Inject('Mail')
        private readonly mail: Mail,
        @Inject('TemplateService')
        private readonly templateService: TemplateService,
        @Inject('LoggerService')
        private readonly logger: LoggerService
    ) {
        DomainEventsImpl
            .getInstance()
            .on('NewMailEvent', async ({ data, recipient, type, attachments }: NewMailEventData<any>) => {
                this.logger.log(`Trying to send email event triggered ${data} ${recipient} ${type} ${attachments}`);
                const template = await this.templateService.getTemplateByMailType(type, data);
                this.logger.log(`Email template found ${template} `);
                try {
                    const response = await this.mail.sendMail({
                        from: `"yugokraft" ${process.env.FROM_MAIL}`,
                        subject: 'Yugokraft',
                        to: recipient,
                        html: template,
                        attachments: (attachments || []).length
                            ? attachments
                                .map(({ name, data }) => ({
                                    filename: name,
                                    content: data
                                }))
                            : []
                    });
                    this.logger.log(`Email sent: ${JSON.stringify(response)}`);
                } catch (e) {
                    throw {
                        message:
                            e.message
                            + '\n\t' + 'Code: ' + (e.code || 0).toString() +
                            + '\n\t' + 'Response: ' + JSON.stringify(e.response || {}),
                        stack: e.stack
                    }
                }
            });
    }


}
