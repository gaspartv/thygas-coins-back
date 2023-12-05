import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { UserResponseDto } from './dtos/response/response-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async save(user: User): Promise<UserResponseDto> {
    return await this.repository.save(user);
  }

  async findOrThrow(id: string): Promise<UserResponseDto> {
    const user = await this.repository.find({ id });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async verifyUnique(
    email?: string,
    identityDocument?: string,
    whatsapp?: string,
  ) {
    if (email) {
      const emailAlreadyExists = await this.repository.find({ email });
      if (emailAlreadyExists) {
        throw new ConflictException('email already exists');
      }
    }

    if (identityDocument) {
      const identityDocumentAlreadyExists = await this.repository.find({
        identityDocument,
      });
      if (identityDocumentAlreadyExists) {
        throw new ConflictException('identity document already exists');
      }
    }

    if (whatsapp) {
      const whatsappAlreadyExists = await this.repository.find({
        whatsapp,
      });
      if (whatsappAlreadyExists) {
        throw new ConflictException('whatsapp already exists');
      }
    }
  }
}
