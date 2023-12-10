import { IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(5)
  @MaxLength(120)
  new_password: string;

  @IsString()
  @MinLength(5)
  @MaxLength(120)
  confirm_new_password: string;
}
