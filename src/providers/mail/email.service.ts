import { SendGridService } from '@anchan828/nest-sendgrid';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';

class Send {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class EmailProvider {
  constructor(private readonly sendGrid: SendGridService) {}

  async send(dto: Send) {
    await this.sendGrid.send({
      ...dto,
      from: process.env.FROM_EMAIL,
    });
  }
}
