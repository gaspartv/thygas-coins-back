import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { PrismaModule } from '../prisma/prisma.module';
import { CronService } from './cron.service';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [CronService],
})
export class CronModule {}
