import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { TokenTypeEnum } from './enum/token-type.enum';
import { TokensRepository } from './repositories/tokens.repository';
import { Tokens } from './tokens.entity';

@Injectable()
export class TokensService {
  constructor(private readonly repository: TokensRepository) {}

  async create(userId: string, type: TokenTypeEnum) {
    const lastRequest = await this.repository.find({
      userId,
      usedAt: null,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    });

    if (lastRequest) {
      const diff = Math.abs(
        new Date().getTime() - new Date(lastRequest.createdAt).getTime(),
      );

      const minutesDiff = Math.ceil(diff / (1000 * 60));

      if (minutesDiff < 5) {
        throw new ConflictException(
          'You have just changed your password, wait a few minutes.',
        );
      }
    }

    const tokens = await this.repository.findMany({
      userId,
      usedAt: null,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    });

    for await (const passwordToken of tokens) {
      const token = new Tokens(passwordToken);
      token.setRevokedAt(new Date());
      token.setType(type);
      await this.repository.save(token);
    }

    const token = new Tokens({});
    token.create(userId);
    token.setType(type);
    await this.repository.save(token);
    return token.get();
  }
}