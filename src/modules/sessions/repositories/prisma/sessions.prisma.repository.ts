import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PrismaService } from '../../../../providers/prisma/prisma.service';
import { FindSessionDto } from '../../dtos/internal/find-session.dto';
import { SessionResponseDto } from '../../dtos/response/response-session.dto';
import { Session } from '../../sessions.entity';
import { SessionsRepository } from '../sessions.repository';

@Injectable()
export class SessionsPrismaRepository implements SessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(session: Session): Promise<SessionResponseDto> {
    return await this.prisma.session.upsert({
      create: session.get(),
      update: session.get(),
      where: { id: session.getId() },
    });
  }

  async disconnectedMany(userId: string): Promise<{ count: number }> {
    return await this.prisma.session.updateMany({
      where: {
        userId,
        disconnectedAt: null,
      },
      data: { disconnectedAt: new Date() },
    });
  }

  async find(where: FindSessionDto): Promise<SessionResponseDto> {
    return await this.prisma.session.findFirst({ where });
  }
}
