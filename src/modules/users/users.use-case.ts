import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { UpdateUserDto } from './dtos/request/update-user.dto';
import { UserResponseDto } from './dtos/response/response-user.dto';
import { User } from './users.entity';
import { UserMapper } from './users.mapper';
import { UsersService } from './users.service';

@Injectable()
export class UsersUseCase {
  constructor(private readonly service: UsersService) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const user = new User({});
    user.create(dto);
    await this.service.verifyUnique(
      user.getEmail(),
      user.getIdentityDocument(),
      user.getWhatsapp(),
    );
    const save = await this.service.save(user);
    return UserMapper.response(save);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const userFound = await this.service.findOrThrow(id);
    const user = new User(userFound);
    user.update(dto);
    const save = await this.service.save(user);
    return UserMapper.response(save);
  }

  async find(id: string): Promise<UserResponseDto> {
    const user = await this.service.findOrThrow(id);
    return UserMapper.response(user);
  }
}
