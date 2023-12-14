import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { EmailProvider } from './email.provider';
import { NodemailerProvider } from './nodemailer.provider';

@Module({
  providers: [
    {
      provide: EmailProvider,
      useClass: NodemailerProvider,
    },
  ],
  exports: [EmailProvider],
})
export class EmailModule {}
