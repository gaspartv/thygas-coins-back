import { ApiProperty } from '@nestjs/swagger';

export class UserFindStatus404Response {
  @ApiProperty({
    example: ['user not found'],
  })
  message: string[];

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: 404 })
  statusCode: number;
}
