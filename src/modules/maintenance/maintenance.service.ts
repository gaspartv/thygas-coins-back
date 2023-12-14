import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { FindMaintenanceDto } from './dtos/internal/find-maintenance.dto';
import { MaintenanceResponseDto } from './dtos/response/response-maintenance.dto';
import { Maintenance } from './maintenance.entity';
import { MaintenanceRepository } from './repositories/maintenance.repository';

@Injectable()
export class MaintenanceService {
  constructor(private readonly repository: MaintenanceRepository) {}

  async save(Maintenance: Maintenance): Promise<MaintenanceResponseDto> {
    await this.repository.disabledMany({
      userId: Maintenance.getUserId(),
    });
    return await this.repository.save(Maintenance);
  }

  async find(where: FindMaintenanceDto): Promise<MaintenanceResponseDto> {
    return await this.repository.find(where);
  }

  async disabledMany(where: FindMaintenanceDto): Promise<{
    count: number;
  }> {
    return await this.repository.disabledMany(where);
  }
}
