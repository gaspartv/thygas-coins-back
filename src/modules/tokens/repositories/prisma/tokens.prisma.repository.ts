import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PrismaService } from '../../../../providers/prisma/prisma.service';
import { FindTokenDto } from '../../dtos/internal/find.dto';
import { TokenResponseDto } from '../../dtos/response/response-token.dto';
import { Tokens } from '../../tokens.entity';
import { TokensRepository } from '../tokens.repository';

@Injectable()
export class TokensPrismaRepository implements TokensRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(token: Tokens): Promise<TokenResponseDto> {
    return await this.prisma.token.upsert({
      where: { id: token.getId() },
      create: token.get(),
      update: token.get(),
    });
  }

  async find(where: FindTokenDto): Promise<TokenResponseDto> {
    return await this.prisma.token.findFirst({
      where,
    });
  }

  async findMany(where: FindTokenDto): Promise<TokenResponseDto[]> {
    return await this.prisma.token.findMany({
      where,
    });
  }
}
