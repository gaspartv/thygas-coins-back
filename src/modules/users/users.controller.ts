import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator';
import {
  Delete,
  Get,
  Patch,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Param,
  Query,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { ParseBoolPipe } from '@nestjs/common/pipes/parse-bool.pipe';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';
import { ParseUUIDPipe } from '@nestjs/common/pipes/parse-uuid.pipe';
import { ApiTags } from '@nestjs/swagger';
import { CustomApiCreateUserResponse } from './decorators/api-create-user-response.decorator';
import { CustomApiFindUserResponse } from './decorators/api-find-user-response.decorator';
import { CustomApiUpdateUserResponse } from './decorators/api-update-user-response.decorator';
import { OrderByUserDto } from './dtos/internal/order-user.dto';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { UpdateEmailUserDto } from './dtos/request/update-email-user.dto';
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
  create(@Body() body: CreateUserDto) {
    return this.useCase.create(body);
  }

  @Patch('update/:id')
  @HttpCode(200)
  @CustomApiUpdateUserResponse()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.useCase.update(id, body);
  }

  @Get('find/:id')
  @HttpCode(200)
  @CustomApiFindUserResponse()
  find(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.useCase.find(id);
  }

  @Get('find-many')
  @HttpCode(200)
  findMany(
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('size', new ParseIntPipe({ optional: true })) size: number,
    @Query('disabled', new ParseBoolPipe({ optional: true }))
    disabledAt?: boolean,
    @Query('deleted', new ParseBoolPipe({ optional: true }))
    deletedAt?: boolean,
    @Query('created-order') createdOrder?: 'asc' | 'desc',
    @Query('email-order') emailOrder?: 'asc' | 'desc',
    @Query('firstName-order') firstNameOrder?: 'asc' | 'desc',
    @Query('lastName-order') lastNameOrder?: 'asc' | 'desc',
  ) {
    const where = {
      disabledAt: disabledAt ? disabledAt : undefined,
      deletedAt: deletedAt ? deletedAt : undefined,
    };
    const orderBy: OrderByUserDto = {
      createdAt: createdOrder ? createdOrder : undefined,
      email: emailOrder ? emailOrder : undefined,
      firstName: firstNameOrder ? firstNameOrder : undefined,
      lastName: lastNameOrder ? lastNameOrder : undefined,
    };
    let order: OrderByUserDto | undefined;
    for (const key in orderBy) {
      if (orderBy[key] !== undefined) {
        if (key === 'createdAt') order = { createdAt: orderBy[key] };
        if (key === 'email') order = { email: orderBy[key] };
        if (key === 'firstName') order = { firstName: orderBy[key] };
        if (key === 'lastName') order = { lastName: orderBy[key] };
        break;
      }
    }
    return this.useCase.findMany(where, page, size, order);
  }

  @Patch('disabled/:id')
  disable(@Param('id', ParseUUIDPipe) id: string) {
    return this.useCase.disable(id);
  }

  @Patch('enabled/:id')
  enable(@Param('id', ParseUUIDPipe) id: string) {
    return this.useCase.enable(id);
  }

  @Delete('deleted/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.useCase.delete(id);
  }

  @Patch('update-email/:id')
  updateEmail(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateEmailUserDto,
  ) {
    return this.useCase.updateEmail(id, body.email);
  }

  @Patch('update-password/:id')
  updatePassword(@Param('id', ParseUUIDPipe) id: string) {
    return this.useCase.updatePassword(id);
  }
}
