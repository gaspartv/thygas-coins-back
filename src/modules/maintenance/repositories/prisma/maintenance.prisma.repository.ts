import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PrismaService } from '../../../../providers/prisma/prisma.service';
import { FindMaintenanceDto } from '../../dtos/internal/find-maintenance.dto';
import { MaintenanceResponseDto } from '../../dtos/response/response-maintenance.dto';
import { Maintenance } from '../../maintenance.entity';
import { MaintenanceRepository } from '../maintenance.repository';

@Injectable()
export class MaintenancePrismaRepository implements MaintenanceRepository {
  constructor(private readonly prisma: PrismaService) {}
  async save(Maintenance: Maintenance): Promise<MaintenanceResponseDto> {
    return await this.prisma.systemMaintenance.upsert({
      where: { id: Maintenance.getId() },
      create: Maintenance.get(),
      update: Maintenance.get(),
    });
  }

  async find(where: FindMaintenanceDto): Promise<MaintenanceResponseDto> {
    return await this.prisma.systemMaintenance.findFirst({ where });
  }

  async disabledMany(where: FindMaintenanceDto): Promise<{ count: number }> {
    return await this.prisma.systemMaintenance.updateMany({
      where: {
        ...where,
        endMaintenance: null,
      },
      data: { endMaintenance: new Date() },
    });
  }
}
