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
import { IsAdmin } from '../../common/decorators/is-admin.decorator';
import { MessageDto } from '../../common/dtos/message.dto';
import { IsPublic } from '../sessions/decorators/is-public.decorator';
import { Sign } from '../sessions/decorators/sign.decorator';
import { SignInterface } from '../sessions/interfaces/jwt-payload.interface';
import { CustomApiCreateUserResponse } from './decorators/api-create-user-response.decorator';
import { CustomApiFindUserResponse } from './decorators/api-find-user-response.decorator';
import { CustomApiUpdateUserResponse } from './decorators/api-update-user-response.decorator';
import { OrderByUserDto } from './dtos/internal/order-user.dto';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { UpdateEmailUserDto } from './dtos/request/update-email-user.dto';
import { UploadFileUserDto } from './dtos/request/update-image-user.dto';
import { ChangePasswordDto } from './dtos/request/update-password-change-user.dto';
import { ResetPasswordDto } from './dtos/request/update-password-reset-user.dto';
import { UpdateUserDto } from './dtos/request/update-user.dto';
import { UserResponseDto } from './dtos/response/response-user.dto';
import { UsersUseCase } from './users.use-case';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly useCase: UsersUseCase) {}

  @Post('create')
  @IsPublic()
  @HttpCode(201)
  @CustomApiCreateUserResponse()
  create(@Body() body: CreateUserDto): Promise<MessageDto> {
    return this.useCase.create(body);
  }

  @Patch('update/:id')
  @IsAdmin()
  @HttpCode(200)
  @CustomApiUpdateUserResponse()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.useCase.update(id, body);
  }

  @Patch('update-self')
  @HttpCode(200)
  @CustomApiUpdateUserResponse()
  updateSelf(
    @Sign() sign: SignInterface,
    @Body() body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.useCase.update(sign.sub, body);
  }

  @Get('find/:id')
  @IsAdmin()
  @HttpCode(200)
  @CustomApiFindUserResponse()
  find(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.useCase.find(id);
  }

  @Get('find-many')
  @IsAdmin()
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
  @IsAdmin()
  @HttpCode(200)
  disable(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.useCase.disable(id);
  }

  @Patch('disabled-self')
  @HttpCode(200)
  disableSelf(@Sign() sign: SignInterface): Promise<UserResponseDto> {
    return this.useCase.disable(sign.sub);
  }

  @Patch('enabled/:id')
  @IsAdmin()
  @HttpCode(200)
  enable(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.useCase.enable(id);
  }

  @Patch('enabled-self')
  @HttpCode(200)
  enableSelf(@Sign() sign: SignInterface): Promise<UserResponseDto> {
    return this.useCase.enable(sign.sub);
  }

  @Delete('deleted/:id')
  @IsAdmin()
  @HttpCode(200)
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<MessageDto> {
    return this.useCase.delete(id);
  }

  @Delete('deleted-self')
  @HttpCode(200)
  deleteSelf(@Sign() sign: SignInterface): Promise<MessageDto> {
    return this.useCase.delete(sign.sub);
  }

  @Patch('reset-email/:tokenId')
  @HttpCode(200)
  resetEmail(
    @Param('tokenId', ParseUUIDPipe) tokenId: string,
    @Body() body: UpdateEmailUserDto,
  ) {
    return this.useCase.resetEmail(tokenId, body.email);
  }

  @Patch('recovery-email')
  @HttpCode(200)
  recoveryEmail(@Sign() sign: SignInterface): Promise<MessageDto> {
    return this.useCase.recoveryEmail(sign.sub);
  }

  @Patch('change-email')
  @HttpCode(200)
  changeEmail(@Sign() sign: SignInterface, @Body() body: UpdateEmailUserDto) {
    return this.useCase.changeEmail(sign.sub, body.email);
  }

  @Patch('recovery-password')
  @IsPublic()
  @HttpCode(200)
  recoveryPassword(@Body() body: UpdateEmailUserDto): Promise<MessageDto> {
    return this.useCase.recoveryPassword(body.email);
  }

  @Patch('reset-password/:tokenId')
  @IsPublic()
  @HttpCode(200)
  resetPassword(
    @Param('tokenId', ParseUUIDPipe) tokenId: string,
    @Body() body: ResetPasswordDto,
  ): Promise<MessageDto> {
    return this.useCase.resetPassword(tokenId, body);
  }

  @Patch('change-password/:id')
  @IsAdmin()
  @HttpCode(200)
  changePassword(
    @Body() body: ChangePasswordDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MessageDto> {
    return this.useCase.changePassword(id, body);
  }

  @Patch('change-password-self')
  @HttpCode(200)
  changePasswordSelf(
    @Body() body: ChangePasswordDto,
    @Sign() sign: SignInterface,
  ): Promise<MessageDto> {
    return this.useCase.changePassword(sign.sub, body);
  }

  @Patch('update-image/:id')
  @IsAdmin()
  @HttpCode(200)
  updateImage(
    @Body() body: UploadFileUserDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    const file = body.file;
    return this.useCase.updateImage(id, file);
  }

  @Patch('update-image-self')
  @HttpCode(200)
  updateImageSelf(
    @Body() body: UploadFileUserDto,
    @Sign() sign: SignInterface,
  ): Promise<UserResponseDto> {
    const file = body.file;
    return this.useCase.updateImage(sign.sub, file);
  }

  @Get('profile')
  @HttpCode(200)
  profile(@Sign() sign: SignInterface) {
    return this.useCase.profile(sign.sub);
  }
}
