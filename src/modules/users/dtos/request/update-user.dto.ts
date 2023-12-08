import {
  IsAlpha,
  IsBoolean,
  IsEnum,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { UserLanguageEnum } from '../../enum/user-language.enum';

export class UpdateUserDto {
  @IsAlpha()
  @Length(2, 30)
  firstName: string;

  @IsAlpha()
  @Length(2, 30)
  lastName: string;

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
}
