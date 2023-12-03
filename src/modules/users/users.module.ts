import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { PrismaModule } from '../../common/config/prisma/prisma.module';
import { UsersPrismaRepository } from './repositories/prisma/users.prisma.repository';
import { UsersRepository } from './repositories/users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersUseCase } from './users.use-case';

@Module({
  imports: [PrismaModule],
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
