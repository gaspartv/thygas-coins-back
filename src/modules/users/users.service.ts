import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { UpdateUserDto } from './dtos/request/update-user.dto';
import { UserResponseDto } from './dtos/response/response-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async saveUser(user: User): Promise<UserResponseDto> {
    return await this.repository.save(user);
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const password = randomUUID();
    const user = new User({});
    user.setWhatsapp(dto.whatsapp);
    user.setId(randomUUID());
    user.setCreatedAt(new Date());
    user.setUpdatedAt(new Date());
    user.setDisabledAt(null);
    user.setDeletedAt(null);
    user.setFirstName(dto.firstName);
    user.setLastName(dto.lastName);
    user.setEmail(dto.email);
    user.setPassword(password);
    user.setIdentityDocument(dto.identityDocument);
    user.setDarkMode(dto.darkMode);
    user.setLanguage(dto.language);
    user.setPolice(dto.police);
    return user;
  }

  async updateUser(
    userFound: UserResponseDto,
    dto: UpdateUserDto,
  ): Promise<User> {
    const user = new User(userFound);
    user.setUpdatedAt(new Date());
    if (dto.firstName) user.setFirstName(dto.firstName);
    if (dto.lastName) user.setLastName(dto.lastName);
    if (dto.email) user.setEmail(dto.email);
    if (dto.identityDocument) user.setIdentityDocument(dto.identityDocument);
    if (dto.whatsapp) user.setWhatsapp(dto.whatsapp);
    if (dto.darkMode) user.setDarkMode(dto.darkMode);
    if (dto.language) user.setLanguage(dto.language);
    return user;
  }

  async findUserOrThrow(id: string): Promise<UserResponseDto> {
    const userFound = await this.repository.findWhere({ id });
    if (!userFound) throw new NotFoundException('user not found');
    return userFound;
  }

  async verifyUnique(
    email?: string,
    identityDocument?: string,
    whatsapp?: string,
  ) {
    if (email) {
      const emailAlreadyExists = await this.repository.findWhere({ email });
      if (emailAlreadyExists) {
        throw new ConflictException('email already exists');
      }
    }

    if (identityDocument) {
      const identityDocumentAlreadyExists = await this.repository.findWhere({
        identityDocument,
      });
      if (identityDocumentAlreadyExists) {
        throw new ConflictException('identity document already exists');
      }
    }

    if (whatsapp) {
      const whatsappAlreadyExists = await this.repository.findWhere({
        whatsapp,
      });
      if (whatsappAlreadyExists) {
        throw new ConflictException('whatsapp already exists');
      }
    }
  }
}
