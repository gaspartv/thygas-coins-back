import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { PrismaModule } from '../../common/config/prisma/prisma.module';
import { FileModule } from '../../providers/file/file.module';
import { HttpModule } from '../../providers/http/http.module';
import { EmailModule } from '../../providers/mail/email.module';
import { UsersPrismaRepository } from './repositories/prisma/users.prisma.repository';
import { UsersRepository } from './repositories/users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersUseCase } from './users.use-case';

@Module({
  imports: [PrismaModule, EmailModule, HttpModule, FileModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersUseCase,
    {
      provide: UsersRepository,
      useClass: UsersPrismaRepository,
    },
  ],
})
export class UsersModule {}
