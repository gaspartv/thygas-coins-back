import { FindManyUserDto } from '../dtos/internal/find-many-user.dto';
import { FindUserDto } from '../dtos/internal/find-user.dto';
import { OrderByUserDto } from '../dtos/internal/order-user.dto';
import { UserResponseDto } from '../dtos/response/response-user.dto';
import { User } from '../users.entity';

export abstract class UsersRepository {
  abstract save(user: User): Promise<UserResponseDto>;
  abstract find(where: FindUserDto): Promise<UserResponseDto>;
  abstract findMany(
    where: FindManyUserDto,
    page: number,
    size: number,
    orderBy?: OrderByUserDto | undefined,
  ): Promise<any>;
}
