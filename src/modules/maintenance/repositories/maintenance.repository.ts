import { FindMaintenanceDto } from '../dtos/internal/find-maintenance.dto';
import { MaintenanceResponseDto } from '../dtos/response/response-maintenance.dto';
import { Maintenance } from '../maintenance.entity';

export abstract class MaintenanceRepository {
  abstract save(Maintenance: Maintenance): Promise<MaintenanceResponseDto>;
  abstract find(where: FindMaintenanceDto): Promise<MaintenanceResponseDto>;
  abstract disabledMany(where: FindMaintenanceDto): Promise<{ count: number }>;
}
