import { applyDecorators } from '@nestjs/common/decorators/core/apply-decorators';
import { ApiResponse } from '@nestjs/swagger';
import { UserCreateStatus409Response } from '../dtos/response/status/create-response-status-409.dto';
import { UserCreateStatus422Response } from '../dtos/response/status/create-response-status-422.dto';

export function CustomApiCreateUserResponse(): MethodDecorator {
  return applyDecorators(
    ApiResponse({
      status: 409,
      type: UserCreateStatus409Response,
    }),
    ApiResponse({
      status: 422,
      type: UserCreateStatus422Response,
    }),
  );
}
