import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from './decorators/is-public.decorator';
import { RequestSignInDto } from './dtos/request/sign-in.dto';
import { SessionsUseCase } from './sessions.use-case';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly useCase: SessionsUseCase) {}

  @IsPublic()
  @Post('sign-in')
  @HttpCode(200)
  signIn(@Body() body: RequestSignInDto) {
    return this.useCase.signIn(body);
  }
}
