import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { join } from 'path';
import { FileProvider } from '../../providers/file/file.provider';
import { HttpService } from '../../providers/http/http.provider';
import { createUserTemplate } from '../../providers/http/templates/create-user';
import { EmailProvider } from '../../providers/mail/email.provider';
import { TokenTypeEnum } from '../tokens/enum/token-type.enum';
import { Tokens } from '../tokens/tokens.entity';
import { TokensService } from '../tokens/tokens.service';
import { FindManyUserDto } from './dtos/internal/find-many-user.dto';
import { OrderByUserDto } from './dtos/internal/order-user.dto';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { IFileUpload } from './dtos/request/update-image-user.dto';
import { ChangePasswordDto } from './dtos/request/update-password-change-user.dto';
import { ResetPasswordDto } from './dtos/request/update-password-reset-user.dto';
import { UpdateUserDto } from './dtos/request/update-user.dto';
import { UserResponseDto } from './dtos/response/response-user.dto';
import { User } from './users.entity';
import { UserMapper } from './users.mapper';
import { UsersService } from './users.service';

@Injectable()
export class UsersUseCase {
  constructor(
    private readonly service: UsersService,
    private readonly email: EmailProvider,
    private readonly http: HttpService,
    private readonly file: FileProvider,
    private readonly tokens: TokensService,
  ) {}

  async create(dto: CreateUserDto) {
    const user = new User({});
    await user.create(dto);
    await this.service.verifyUnique(
      user.getEmail(),
      user.getIdentityDocument(),
      user.getWhatsapp(),
    );
    const save = await this.service.save(user);
    const token = await this.tokens.create(save.id, TokenTypeEnum.PASSWORD);
    const html = await this.service.htmlCreateUser(save.firstName, token.id);
    const text = createUserTemplate(save.firstName, token.id);
    const url = `${process.env.WHATSAPP_FAKE_URL}/message/sendText/${process.env.WHATSAPP_FAKE_INSTANCE_NAME}`;
    const body = {
      number: save.whatsapp,
      textMessage: { text },
    };
    const headers = {
      apikey: process.env.WHATSAPP_FAKE_APIKEY,
      'Content-Type': 'application/json',
    };
    this.http.post(url, body, headers);
    this.email.send({
      subject: 'Account created successfully - ' + process.env.COMPANY_NAME,
      to: save.email,
      html,
    });
    return { message: 'email to create password sent' };
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const userFound = await this.service.findOrThrow(id);
    const user = new User(userFound);
    await this.service.verifyUnique(
      null,
      dto.identityDocument,
      dto.whatsapp,
      user,
    );
    user.update(dto);
    const save = await this.service.save(user);
    return UserMapper.response(save);
  }

  async find(id: string): Promise<UserResponseDto> {
    const user = await this.service.findOrThrow(id);
    return UserMapper.response(user);
  }

  async findMany(
    where: FindManyUserDto,
    page: number,
    size: number,
    orderBy?: OrderByUserDto | undefined,
  ) {
    return await this.service.findMany(where, page, size, orderBy);
  }

  async disable(id: string) {
    const userFound = await this.service.findOrThrow(id);
    const user = new User(userFound);
    if (user.disabledAt !== null) {
      throw new ConflictException('user already disabled');
    }
    user.setUpdatedAt(new Date());
    user.setDisabledAt(new Date());
    const save = await this.service.save(user);
    return UserMapper.response(save);
  }

  async enable(id: string) {
    const userFound = await this.service.findOrThrow(id);
    const user = new User(userFound);
    if (user.disabledAt === null) {
      throw new ConflictException('user already enabled');
    }
    user.setUpdatedAt(new Date());
    user.setDisabledAt(null);
    const save = await this.service.save(user);
    return UserMapper.response(save);
  }

  async delete(id: string) {
    const userFound = await this.service.findOrThrow(id);
    const user = new User(userFound);
    if (user.deletedAt !== null) {
      throw new ConflictException('user already deleted');
    }
    if (user.disabledAt === null) user.setDisabledAt(new Date());
    user.setUpdatedAt(new Date());
    user.setDeletedAt(new Date());
    await this.service.save(user);
    return { message: 'deleted user successfully' };
  }

  async changeEmail(id: string, email: string) {
    const userIdFound = await this.service.findOrThrow(id);
    const userEmailFound = await this.service.findEmail(email);
    if (userEmailFound) {
      if (userEmailFound.email === userIdFound.email) {
        throw new ConflictException('this is your email');
      }
      throw new ConflictException('user already exists');
    }
    const user = new User(userIdFound);
    user.setUpdatedAt(new Date());
    user.setEmail(email);
    const save = await this.service.save(user);
    return UserMapper.response(save);
  }

  async resetEmail(tokenId: string, email: string) {
    const tokenFound = await this.tokens.tokenOrThrow(tokenId);
    const token = new Tokens(tokenFound);
    const userFound = await this.service.findOrThrow(token.getUserId());
    const user = new User(userFound);
    token.verifyExpiresAt();
    token.verifyUsedAt();
    token.verifyRevokedAt();
    token.setRevokedAt(new Date());
    token.setUsedAt(new Date());
    user.setEmail(email);
    await this.service.save(user);
    await this.tokens.save(token);
    return { message: 'email updated successfully' };
  }

  async recoveryEmail(id: string) {
    const userIdFound = await this.service.findOrThrow(id);
    if (!userIdFound) {
      throw new NotFoundException('user not found');
    }
    const user = new User(userIdFound);
    const token = await this.tokens.create(
      user.getId(),
      TokenTypeEnum.PASSWORD,
    );
    const html = await this.service.htmlChangeEmail(
      user.getFirstName(),
      token.id,
    );
    this.email.send({
      subject: 'Change email - ' + process.env.COMPANY_NAME,
      to: user.getEmail(),
      html,
    });
    return { message: 'email to change email sent' };
  }

  async recoveryPassword(email: string) {
    const userFound = await this.service.findEmail(email);
    if (!userFound) throw new NotFoundException('email not found');
    const token = await this.tokens.create(
      userFound.id,
      TokenTypeEnum.PASSWORD,
    );
    const html = await this.service.htmlChangePassword(
      userFound.firstName,
      token.id,
    );
    this.email.send({
      subject: 'Change password - ' + process.env.COMPANY_NAME,
      to: email,
      html,
    });
    return { message: 'email to change password sent' };
  }

  async resetPassword(tokenId: string, dto: ResetPasswordDto) {
    const tokenFound = await this.tokens.tokenOrThrow(tokenId);
    const token = new Tokens(tokenFound);
    const userFound = await this.service.findOrThrow(token.getUserId());
    const user = new User(userFound);
    user.verifyPassword(dto.new_password, dto.confirm_new_password);
    token.verifyExpiresAt();
    token.verifyUsedAt();
    token.verifyRevokedAt();
    user.verifyPasswordEqual(dto.new_password, userFound.password);
    await user.setPassword(dto.new_password);
    token.setRevokedAt(new Date());
    token.setUsedAt(new Date());
    await this.service.save(user);
    await this.tokens.save(token);
    return { message: 'Password updated successfully' };
  }

  async updateImage(id: string, file: IFileUpload) {
    const userFound = await this.service.findOrThrow(id);
    if (userFound.imageUri) {
      try {
        this.file.remove(join('user', 'avatar', userFound.imageUri));
      } catch (error) {
        console.error(error.message);
      }
    }
    const user = new User(userFound);
    if (file) {
      const avatarUri = this.file.save(file, join('user', 'avatar'));
      user.setImageUri(avatarUri);
      const save = await this.service.save(user);
      return UserMapper.response(save);
    } else {
      user.setImageUri(null);
      const save = await this.service.save(user);
      return UserMapper.response(save);
    }
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const userFound = await this.service.findOrThrow(id);
    const user = new User(userFound);
    user.verifyPasswordNotEqual(dto.password, userFound.password);
    user.verifyPassword(dto.new_password, dto.confirm_new_password);
    user.verifyPasswordEqual(dto.new_password, userFound.password);
    await user.setPassword(dto.new_password);
    await this.service.save(user);
    return { message: 'Password updated successfully' };
  }

  async profile(userId: string) {
    const user = await this.service.findOrThrow(userId);
    return UserMapper.response(user);
  }
}
