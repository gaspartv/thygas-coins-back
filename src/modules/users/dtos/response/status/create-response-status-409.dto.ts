import { ApiProperty } from '@nestjs/swagger';

export class UserCreateStatus409Response {
  @ApiProperty({
    example: [
      'The first name must only have letters between 2 and 30 characters',
      'The last name must only have letters between 2 and 30 characters',
      'email is not valid',
      'the password must be between 8 and 50 characters long, contain at least one uppercase letter, one lowercase letter, one special character, and cannot have numeric or alphabetic sequences of three characters or more',
      'URI is not valid',
      'invalid identity document',
      'invalid whatsapp. Exempla: 55xx9xxxxxxxx - Between 10 and 13 numbers entered',
      'darkMode must be of type Boolean',
      'language needs to be en_us or pt_br',
      'police needs to be normal, viewer, admin or super',
    ],
  })
  message: string[];

  @ApiProperty({ example: 'Conflict' })
  error: string;

  @ApiProperty({ example: 409 })
  statusCode: number;
}
