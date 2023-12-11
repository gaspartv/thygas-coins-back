export class MaintenanceResponseDto {
  id: string;
  startMaintenance: Date;
  endMaintenance: Date | null;
  description: string | null;
  userId: string;
}
