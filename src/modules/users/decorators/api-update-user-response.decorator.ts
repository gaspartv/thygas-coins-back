import { applyDecorators } from '@nestjs/common/decorators/core/apply-decorators';
import { ApiResponse } from '@nestjs/swagger';
import { UserCreateStatus409Response } from '../dtos/response/status/create-response-status-409.dto';
import { UserUpdateStatus400Response } from '../dtos/response/status/update-response-status-400.dto';
import { UserUpdateStatus404Response } from '../dtos/response/status/update-response-status-404.dto';
import { UserUpdateStatus422Response } from '../dtos/response/status/update-response-status-422.dto';

export function CustomApiUpdateUserResponse(): MethodDecorator {
  return applyDecorators(
    ApiResponse({
      status: 400,
      type: UserUpdateStatus400Response,
    }),
    ApiResponse({
      status: 404,
      type: UserUpdateStatus404Response,
    }),
    ApiResponse({
      status: 409,
      type: UserCreateStatus409Response,
    }),
    ApiResponse({
      status: 422,
      type: UserUpdateStatus422Response,
    }),
  );
}
