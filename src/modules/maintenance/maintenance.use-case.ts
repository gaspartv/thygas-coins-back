import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { CreateMaintenanceDto } from './dtos/request/create-maintenance.dto';
import { MaintenanceResponseDto } from './dtos/response/response-maintenance.dto';
import { Maintenance } from './maintenance.entity';
import { MaintenanceRepository } from './repositories/maintenance.repository';

@Injectable()
export class MaintenanceUseCase {
  constructor(private readonly repository: MaintenanceRepository) {}

  async startMaintenance(
    userId: string,
    dto: CreateMaintenanceDto,
  ): Promise<MaintenanceResponseDto> {
    const maintenance = new Maintenance({});
    maintenance.create(userId, dto.description);
    return await this.repository.save(maintenance);
  }
}
