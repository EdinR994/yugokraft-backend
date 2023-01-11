import {Body, Controller, Inject, Post, UsePipes, ValidationPipe} from "@nestjs/common";
import {ContactSupportDto} from "./contactSupport.dto";
import {DomainEvents} from "../core/domainEvents";
import {NewMailEvent} from "./newMail.event";

@Controller('emails')
export class EmailController {

  constructor(
      @Inject('DomainEvents')
      private readonly events: DomainEvents
  ) {}

  @Post('support')
  @UsePipes(new ValidationPipe())
  contactSupport(@Body() { sender, message }: ContactSupportDto) {
    this.events.push(new NewMailEvent({
      recipient: process.env.SUPPORT_EMAIL!,
      type: "text",
      data: `Message from ${sender}: ${message}`
    }));
    return true;
  }

}