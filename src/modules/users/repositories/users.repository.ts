import { FindWhereUserDto } from '../dtos/internal/find-where-user.dto';
import { UserResponseDto } from '../dtos/response/response-user.dto';
import { User } from '../users.entity';

export abstract class UsersRepository {
  abstract save(user: User): Promise<UserResponseDto>;
  abstract find(where: FindWhereUserDto): Promise<UserResponseDto>;
}
