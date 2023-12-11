import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { CronService } from './cron.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CronService],
})
export class CronModule {}
