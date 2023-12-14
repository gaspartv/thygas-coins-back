import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator';
import {
  Patch,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiTags } from '@nestjs/swagger';
import { IsSuper } from '../../common/decorators/is-super.decorator';
import { MessageDto } from '../../common/dtos/message.dto';
import { Sign } from '../sessions/decorators/sign.decorator';
import { SignInterface } from '../sessions/interfaces/jwt-payload.interface';
import { CreateMaintenanceDto } from './dtos/request/create-maintenance.dto';
import { MaintenanceResponseDto } from './dtos/response/response-maintenance.dto';
import { MaintenanceUseCase } from './maintenance.use-case';

@ApiTags('Maintenance')
@Controller('maintenance')
@IsSuper()
export class MaintenanceController {
  constructor(private readonly userCase: MaintenanceUseCase) {}

  @Post('start')
  @HttpCode(201)
  startMaintenance(
    @Sign() sign: SignInterface,
    @Body() body: CreateMaintenanceDto,
  ): Promise<MaintenanceResponseDto> {
    return this.userCase.startMaintenance(sign.sub, body);
  }

  @Patch('end')
  @HttpCode(200)
  endMaintenance(): Promise<MessageDto> {
    return this.userCase.endMaintenance();
  }
}
