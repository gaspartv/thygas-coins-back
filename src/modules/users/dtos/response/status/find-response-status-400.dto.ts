import { ApiProperty } from '@nestjs/swagger';

export class UserFindStatus400Response {
  @ApiProperty({
    example: ['Validation failed (uuid is expected)'],
  })
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}
