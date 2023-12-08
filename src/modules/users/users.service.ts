import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import * as fs from 'fs';
import handlebars from 'handlebars';
import { resolve } from 'path';
import { mainDirname } from '../../root-dirname';
import { Format } from '../../utils/format-whatsapp';
import { FindManyUserDto } from './dtos/internal/find-many-user.dto';
import { OrderByUserDto } from './dtos/internal/order-user.dto';
import { UserResponseDto } from './dtos/response/response-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { User } from './users.entity';
import { UserMapper } from './users.mapper';

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
    user?: User,
  ) {
    if (email) {
      if (email !== user?.getEmail()) {
        const emailAlreadyExists = await this.repository.find({ email });
        if (emailAlreadyExists) {
          throw new ConflictException('email already exists');
        }
      }
    }

    if (identityDocument) {
      if (identityDocument !== user?.getIdentityDocument()) {
        const identityDocumentAlreadyExists = await this.repository.find({
          identityDocument,
        });
        if (identityDocumentAlreadyExists) {
          throw new ConflictException('identity document already exists');
        }
      }
    }

    if (whatsapp) {
      if (Format.whatsapp(whatsapp) !== user?.getWhatsapp()) {
        const whatsappAlreadyExists = await this.repository.find({
          whatsapp,
        });
        if (whatsappAlreadyExists) {
          throw new ConflictException('whatsapp already exists');
        }
      }
    }
  }

  async findMany(
    where: FindManyUserDto,
    page: number,
    size: number,
    orderBy?: OrderByUserDto | undefined,
  ) {
    const data = await this.repository.findMany(where, page, size, orderBy);

    const uri = `${where.disabledAt ? '?disabled=true' : ''}${
      where.deletedAt ? '?deleted=true' : ''
    }${
      orderBy
        ? orderBy.createdAt
          ? '?created-order=' + orderBy.createdAt
          : ''
        : ''
    }${orderBy ? (orderBy.email ? '?email-order=' + orderBy.email : '') : ''}${
      orderBy
        ? orderBy.firstName
          ? '?firstName-order=' + orderBy.firstName
          : ''
        : ''
    }${
      orderBy
        ? orderBy.lastName
          ? '?lastName-order=' + orderBy.lastName
          : ''
        : ''
    }`;

    return {
      total: data.count,
      previus:
        page > 1
          ? `${process.env.URL_BACK}/users/find-many?page=${
              page <= 1 ? 1 : page - 1
            }&size=${size}${uri}`
          : null,
      next:
        page * size < data.count
          ? `${process.env.URL_BACK}/users/find-many?page=${
              page + 1
            }&size=${size}${uri}`
          : null,
      result: data.users.map((user: UserResponseDto) =>
        UserMapper.response(user),
      ),
    };
  }

  async htmlCreateUser(name: string, token: string) {
    const createUserTemplate = resolve(
      mainDirname,
      'src',
      'providers',
      'mail',
      'templates',
      'create-user.hbs',
    );
    const variables = {
      name,
      companyName: process.env.COMPANY_NAME,
      link: `${process.env.URL_FRONT}/change-password/${token}`,
    };
    const templateFileContent = await fs.promises.readFile(createUserTemplate, {
      encoding: 'utf-8',
    });
    const parseTemplate = handlebars.compile(templateFileContent);
    return parseTemplate(variables);
  }

  async htmlChangeEmail(name: string, token: string) {
    const createUserTemplate = resolve(
      mainDirname,
      'src',
      'providers',
      'mail',
      'templates',
      'change-email.hbs',
    );
    const variables = {
      name,
      companyName: process.env.COMPANY_NAME,
      link: `${process.env.URL_FRONT}/change-email/${token}`,
    };
    const templateFileContent = await fs.promises.readFile(createUserTemplate, {
      encoding: 'utf-8',
    });
    const parseTemplate = handlebars.compile(templateFileContent);
    return parseTemplate(variables);
  }

  async htmlChangePassword(name: string, token: string) {
    const createUserTemplate = resolve(
      mainDirname,
      'src',
      'providers',
      'mail',
      'templates',
      'change-password.hbs',
    );
    const variables = {
      name,
      companyName: process.env.COMPANY_NAME,
      link: `${process.env.URL_FRONT}/change-password/${token}`,
    };
    const templateFileContent = await fs.promises.readFile(createUserTemplate, {
      encoding: 'utf-8',
    });
    const parseTemplate = handlebars.compile(templateFileContent);
    return parseTemplate(variables);
  }

  async findEmail(email: string) {
    return await this.repository.find({ email });
  }
}
