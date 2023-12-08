import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { join } from 'path';
import { FileProvider } from '../../providers/file/file.provider';
import { HttpService } from '../../providers/http/http.provider';
import { createUserTemplate } from '../../providers/http/templates/create-user';
import { EmailProvider } from '../../providers/mail/email.service';
import { FindManyUserDto } from './dtos/internal/find-many-user.dto';
import { OrderByUserDto } from './dtos/internal/order-user.dto';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { IFileUpload } from './dtos/request/update-image-user.dto';
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
  ) {}

  async create(dto: CreateUserDto) {
    const user = new User({});
    user.create(dto);
    await this.service.verifyUnique(
      user.getEmail(),
      user.getIdentityDocument(),
      user.getWhatsapp(),
    );
    const save = await this.service.save(user);
    const html = await this.service.htmlCreateUser(save.firstName);
    const text = createUserTemplate(save.firstName);
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
    const save = await this.service.save(user);
    return UserMapper.response(save);
  }

  async updateEmail(id: string, email: string) {
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
    const html = await this.service.htmlChangeEmail(save.firstName);
    this.email.send({
      subject: 'Change email - ' + process.env.COMPANY_NAME,
      to: save.email,
      html,
    });
    return { message: 'email to change email sent' };
  }

  async updatePassword(id: string) {
    const userFound = await this.service.findOrThrow(id);
    const user = new User(userFound);
    const html = await this.service.htmlChangePassword(user.getFirstName());
    this.email.send({
      subject: 'Change password - ' + process.env.COMPANY_NAME,
      to: user.getEmail(),
      html,
    });
    return { message: 'email to change password sent' };
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
}
