import {forwardRef, Module} from '@nestjs/common';
import { EmailController } from './email.controller';
import {EmailEvents} from "./email.events";
import {HbsTemplateService} from "./hbsTemplate.service";
import {createTransport} from "nodemailer";
import * as nodemailerSendgrid from "nodemailer-sendgrid";
import {DomainEventsImpl} from "../../lib/domainEvents.impl";
import {LoggerModule} from "../logger/logger.module";

@Module({
  imports: [
    LoggerModule
  ],
  providers: [
      EmailEvents,
    {
      provide: 'TemplateService',
      useValue: HbsTemplateService.fromPath(process.env.EMAIL_TEMPLATES_PATH)
    },
    {
      provide: 'Mail',
      useValue: createTransport(nodemailerSendgrid({ apiKey: process.env.SENDGRID_KEY }))
    },
    {
      provide: 'DomainEvents',
      useValue: DomainEventsImpl.getInstance()
    }
  ],
  controllers: [EmailController],
  exports: []
})
export class EmailModule {}