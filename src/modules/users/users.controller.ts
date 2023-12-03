import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator';
import {
  Patch,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Param,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { ParseUUIDPipe } from '@nestjs/common/pipes/parse-uuid.pipe';
import { ApiTags } from '@nestjs/swagger';
import { CustomApiCreateUserResponse } from './decorators/api-create-user-response.decorator';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { UpdateUserDto } from './dtos/request/update-user.dto';
import { UserResponseDto } from './dtos/response/response-user.dto';
import { UsersUseCase } from './users.use-case';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly useCase: UsersUseCase) {}

  @Post('create')
  @HttpCode(201)
  @CustomApiCreateUserResponse()
  createUser(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    return this.useCase.createUser(body);
  }

  @Patch('update/:id')
  @HttpCode(200)
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.useCase.updateUser(id, body);
  }
}
