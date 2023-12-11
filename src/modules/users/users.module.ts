import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { FileModule } from '../../providers/file/file.module';
import { HttpModule } from '../../providers/http/http.module';
import { EmailModule } from '../../providers/mail/email.module';
import { PrismaModule } from '../../providers/prisma/prisma.module';
import { TokensModule } from '../tokens/tokens.module';
import { UsersPrismaRepository } from './repositories/prisma/users.prisma.repository';
import { UsersRepository } from './repositories/users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersUseCase } from './users.use-case';

@Module({
  imports: [PrismaModule, EmailModule, HttpModule, FileModule, TokensModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersUseCase,
    {
      provide: UsersRepository,
      useClass: UsersPrismaRepository,
    },
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
