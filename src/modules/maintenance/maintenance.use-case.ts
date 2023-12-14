import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { MessageDto } from '../../common/dtos/message.dto';
import { SessionsService } from '../sessions/sessions.service';
import { CreateMaintenanceDto } from './dtos/request/create-maintenance.dto';
import { MaintenanceResponseDto } from './dtos/response/response-maintenance.dto';
import { Maintenance } from './maintenance.entity';
import { MaintenanceService } from './maintenance.service';

@Injectable()
export class MaintenanceUseCase {
  constructor(
    private readonly service: MaintenanceService,
    private readonly sessionsService: SessionsService,
  ) {}

  async startMaintenance(
    userId: string,
    dto: CreateMaintenanceDto,
  ): Promise<MaintenanceResponseDto> {
    const maintenance = new Maintenance({});
    maintenance.create(userId, dto.description);
    await this.sessionsService.disconnectedManyNot(userId);
    return await this.service.save(maintenance);
  }

  async endMaintenance(): Promise<MessageDto> {
    await this.service.disabledMany({});
    return { message: 'maintenance is disabled' };
  }
}
