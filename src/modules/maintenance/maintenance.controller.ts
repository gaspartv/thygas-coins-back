import { Body, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { ApiTags } from '@nestjs/swagger';
import { IsSuper } from '../../common/decorators/is-super.decorator';
import { Sign } from '../sessions/decorators/sign.decorator';
import { SignInterface } from '../sessions/interfaces/jwt-payload.interface';
import { CreateMaintenanceDto } from './dtos/request/create-maintenance.dto';
import { MaintenanceUseCase } from './maintenance.use-case';

@ApiTags('Maintenance')
@Controller('maintenance')
@IsSuper()
export class MaintenanceController {
  constructor(private readonly userCase: MaintenanceUseCase) {}

  @Post('start')
  startMaintenance(
    @Sign() sign: SignInterface,
    @Body() body: CreateMaintenanceDto,
  ) {
    return this.userCase.startMaintenance(sign.sub, body);
  }
}
