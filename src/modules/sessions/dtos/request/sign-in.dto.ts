import { IsString } from 'class-validator';

export class RequestSignInDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
