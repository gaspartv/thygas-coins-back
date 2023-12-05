import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PrismaService } from '../../../../common/config/prisma/prisma.service';
import { FindManyUserDto } from '../../dtos/internal/find-many-user.dto';
import { FindUserDto } from '../../dtos/internal/find-user.dto';
import { OrderByUserDto } from '../../dtos/internal/order-user.dto';
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

  async find(where: FindUserDto): Promise<UserResponseDto> {
    return await this.prisma.user.findFirst({
      where,
    });
  }

  async findMany(
    dto: FindManyUserDto,
    order: OrderByUserDto,
    page: number,
    size: number,
  ) {
    const where = {
      disabledAt: dto.disabledAt
        ? { not: null }
        : dto.disabledAt === false
          ? null
          : undefined,
      deletedAt: dto.deletedAt
        ? { not: null }
        : dto.deletedAt === false
          ? null
          : undefined,
    };

    const skip = page <= 1 ? 0 * size : (page - 1) * size;

    const take = size;

    const count = await this.prisma.user.count({
      where,
    });

    const users = await this.prisma.user.findMany({
      where,
      orderBy: {
        createdAt: order.createdAt
          ? order.createdAt === 'asc'
            ? 'asc'
            : 'desc'
          : undefined,
        email: order.email
          ? order.email === 'asc'
            ? 'asc'
            : 'desc'
          : undefined,
        firstName: order.firstName
          ? order.firstName === 'asc'
            ? 'asc'
            : 'desc'
          : undefined,
        lastName: order.lastName
          ? order.lastName === 'asc'
            ? 'asc'
            : 'desc'
          : undefined,
      },
      skip,
      take,
    });

    return {
      count,
      users,
    };
  }
}
