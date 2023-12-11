import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator';
import {
  Delete,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from './decorators/is-public.decorator';
import { Sign } from './decorators/sign.decorator';
import { RequestSignInDto } from './dtos/request/sign-in.dto';
import { SignInterface } from './interfaces/jwt-payload.interface';
import { SessionsUseCase } from './sessions.use-case';

@ApiTags('Sessions')
@Controller()
export class SessionsController {
  constructor(private readonly useCase: SessionsUseCase) {}

  @IsPublic()
  @Post('sign-in')
  @HttpCode(200)
  signIn(@Body() body: RequestSignInDto) {
    return this.useCase.signIn(body);
  }

  @Delete('logout')
  @HttpCode(200)
  logout(@Sign() sign: SignInterface) {
    return this.useCase.logout(sign.sub);
  }
}
