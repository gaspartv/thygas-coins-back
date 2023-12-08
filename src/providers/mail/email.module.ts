import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { EmailProvider } from './email.service';

@Module({
  providers: [EmailProvider],
  exports: [EmailProvider],
})
export class EmailModule {}
