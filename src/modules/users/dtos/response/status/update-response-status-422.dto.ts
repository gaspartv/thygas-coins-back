import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateStatus422Response {
  @ApiProperty({
    example: [
      'firstName must be longer than or equal to 2 characters',
      'firstName must contain only letters (a-zA-Z)',
      'lastName must be longer than or equal to 2 characters',
      'lastName must contain only letters (a-zA-Z)',
      'email must be an email',
      'identityDocument must be longer than or equal to 11 characters',
      'identityDocument must be a string',
      'whatsapp must be longer than or equal to 10 characters',
      'whatsapp must be a valid phone number',
      'darkMode must be a boolean value',
      'language needs to be en_us or pt_br',
    ],
  })
  message: string[];

  @ApiProperty({ example: 'Unprocessable Entity' })
  error: string;

  @ApiProperty({ example: 422 })
  statusCode: number;
}
