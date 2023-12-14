import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { PrismaModule } from '../../providers/prisma/prisma.module';
import { SessionsModule } from '../sessions/sessions.module';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceUseCase } from './maintenance.use-case';
import { MaintenanceRepository } from './repositories/maintenance.repository';
import { MaintenancePrismaRepository } from './repositories/prisma/maintenance.prisma.repository';

@Module({
  imports: [PrismaModule, SessionsModule],
  controllers: [MaintenanceController],
  providers: [
    MaintenanceService,
    MaintenanceUseCase,
    {
      provide: MaintenanceRepository,
      useClass: MaintenancePrismaRepository,
    },
  ],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
