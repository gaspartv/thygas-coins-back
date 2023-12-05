import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PrismaService } from '../../../../common/config/prisma/prisma.service';
import { FindWhereUserDto } from '../../dtos/internal/find-where-user.dto';
import { UserResponseDto } from '../../dtos/response/response-user.dto';
import { User } from '../../users.entity';
import { UsersRepository } from '../users.repository';

@Injectable()
export class UsersPrismaRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<UserResponseDto> {
    return await this.prisma.user.upsert({
      where: { id: user.getId() },
      create: user.get(),
      update: user.get(),
    });
  }

  async find(where: FindWhereUserDto): Promise<UserResponseDto> {
    return await this.prisma.user.findFirst({
      where,
    });
  }
}
