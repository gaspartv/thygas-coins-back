import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { PrismaModule } from '../../providers/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { SessionsPrismaRepository } from './repositories/prisma/sessions.prisma.repository';
import { SessionsRepository } from './repositories/sessions.repository';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { SessionsUseCase } from './sessions.use-case';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [SessionsController],
  providers: [
    SessionsService,
    SessionsUseCase,
    {
      provide: SessionsRepository,
      useClass: SessionsPrismaRepository,
    },
  ],
  exports: [SessionsRepository, SessionsService],
})
export class SessionsModule {}
