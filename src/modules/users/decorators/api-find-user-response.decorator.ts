import { applyDecorators } from '@nestjs/common/decorators/core/apply-decorators';
import { ApiResponse } from '@nestjs/swagger';
import { UserFindStatus400Response } from '../dtos/response/status/find-response-status-400.dto';
import { UserFindStatus404Response } from '../dtos/response/status/find-response-status-404.dto';

export function CustomApiFindUserResponse(): MethodDecorator {
  return applyDecorators(
    ApiResponse({
      status: 400,
      type: UserFindStatus400Response,
    }),
    ApiResponse({
      status: 404,
      type: UserFindStatus404Response,
    }),
  );
}
