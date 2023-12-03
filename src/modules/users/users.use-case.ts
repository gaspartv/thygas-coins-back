import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { UpdateUserDto } from './dtos/request/update-user.dto';
import { UserResponseDto } from './dtos/response/response-user.dto';
import { UserMapper } from './users.mapper';
import { UsersService } from './users.service';

@Injectable()
export class UsersUseCase {
  constructor(private readonly service: UsersService) {}

  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.service.createUser(dto);
    await this.service.verifyUnique(
      user.getEmail(),
      user.getIdentityDocument(),
      user.getWhatsapp(),
    );
    const save = await this.service.saveUser(user);
    return UserMapper.response(save);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const userFound = await this.service.findUserOrThrow(id);
    const user = await this.service.updateUser(userFound, dto);
    const save = await this.service.saveUser(user);
    return UserMapper.response(save);
  }
}
