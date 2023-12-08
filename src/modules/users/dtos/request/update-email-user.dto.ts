import { IsEmail } from 'class-validator';

export class UpdateEmailUserDto {
  @IsEmail()
  email: string;
}
