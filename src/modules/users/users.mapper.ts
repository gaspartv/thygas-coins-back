import { UserResponseDto } from './dtos/response/response-user.dto';

export class UserMapper {
  static response(user: UserResponseDto): UserResponseDto {
    return {
      ...user,
      password: undefined,
    };
  }
}
