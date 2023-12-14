import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { createTransport } from 'nodemailer';
import { Send } from './dtos/email-send.dto';
import { EmailProvider } from './email.provider';

@Injectable()
export class NodemailerProvider implements EmailProvider {
  private readonly transporter: any;

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async send(dto: Send): Promise<void> {
    const mailOptions = {
      ...dto,
      from: process.env.SMTP_USER,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
