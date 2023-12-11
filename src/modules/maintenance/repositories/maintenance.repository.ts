import { MaintenanceResponseDto } from '../dtos/response/response-maintenance.dto';
import { Maintenance } from '../maintenance.entity';

export abstract class MaintenanceRepository {
  abstract save(Maintenance: Maintenance): Promise<MaintenanceResponseDto>;
}
