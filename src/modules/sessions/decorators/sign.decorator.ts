import { createParamDecorator } from '@nestjs/common/decorators/http/create-route-param-metadata.decorator';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { SignInterface } from '../interfaces/jwt-payload.interface';
import { JwtRequest } from '../interfaces/jwt-request.interface';

export const Sign = createParamDecorator(
  (_data: unknown, context: ExecutionContext): SignInterface => {
    const request = context.switchToHttp().getRequest<JwtRequest>();
    return request.user.sign;
  },
);
