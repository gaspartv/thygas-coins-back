import { applyDecorators } from '@nestjs/common/decorators/core/apply-decorators';
import { ApiResponse } from '@nestjs/swagger';
import { UserStatus409Response } from '../dtos/response/status/response-status-409.dto';
import { UserStatus422Response } from '../dtos/response/status/response-status-422.dto';

export function CustomApiCreateUserResponse(): MethodDecorator {
  return applyDecorators(
    ApiResponse({
      status: 409,
      type: UserStatus409Response,
    }),
    ApiResponse({
      status: 422,
      type: UserStatus422Response,
    }),
  );
}
