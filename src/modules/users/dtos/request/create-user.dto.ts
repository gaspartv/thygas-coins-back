import {
  IsAlpha,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { UserLanguageEnum } from '../../enum/user-language.enum';
import { UserPoliceEnum } from '../../enum/user-police.enum';

export class CreateUserDto {
  @IsAlpha()
  @Length(2, 30)
  firstName: string;

  @IsAlpha()
  @Length(2, 30)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(11, 11)
  identityDocument: string;

  @IsPhoneNumber('BR')
  @Length(10, 13)
  whatsapp: string;

  @IsBoolean()
  darkMode: boolean;

  @IsEnum(UserLanguageEnum, {
    message: 'language needs to be en_us or pt_br',
  })
  language: UserLanguageEnum;

  @IsEnum(UserPoliceEnum, {
    message: 'police needs to be normal, viewer, admin or super',
  })
  police: UserPoliceEnum;
}
