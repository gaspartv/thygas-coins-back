import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { PrismaModule } from '../../common/config/prisma/prisma.module';
import { TokensPrismaRepository } from './repositories/prisma/tokens.prisma.repository';
import { TokensRepository } from './repositories/tokens.repository';
import { TokensService } from './tokens.service';

@Module({
  imports: [PrismaModule],
  providers: [
    TokensService,
    {
      provide: TokensRepository,
      useClass: TokensPrismaRepository,
    },
  ],
  exports: [TokensService],
})
export class TokensModule {}
