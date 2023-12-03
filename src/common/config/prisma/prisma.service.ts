import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { OnModuleInit } from '@nestjs/common/interfaces/hooks/on-init.interface';
import { Logger } from '@nestjs/common/services/logger.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    Logger.log('>>> Prisma connected');
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    Logger.warn('>>> Prisma disconnected');
    await this.$disconnect();
  }

  extends() {
    return this.$extends({});
  }
}
