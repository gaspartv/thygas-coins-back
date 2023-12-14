import { SendGridService } from '@anchan828/nest-sendgrid';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Send } from './dtos/email-send.dto';
import { EmailProvider } from './email.provider';

@Injectable()
export class SendGridProvider implements EmailProvider {
  constructor(private readonly sendGrid: SendGridService) {}

  async send(dto: Send) {
    await this.sendGrid.send({
      ...dto,
      from: process.env.FROM_EMAIL,
    });
  }
}
