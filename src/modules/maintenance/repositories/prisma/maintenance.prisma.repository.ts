import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../providers/prisma/prisma.service';
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
}
