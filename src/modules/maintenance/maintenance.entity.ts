import { ConflictException } from '@nestjs/common';
import { randomUUID } from 'crypto';

interface MaintenanceInterface {
  id?: string;
  startMaintenance?: Date;
  endMaintenance?: Date;
  description?: string;
  userId?: string;
}

export class Maintenance {
  private id: string;
  private startMaintenance: Date;
  private endMaintenance: Date;
  private description: string;
  private userId: string;

  constructor(maintenance: MaintenanceInterface) {
    this.id = maintenance.id;
    this.startMaintenance = maintenance.startMaintenance;
    this.endMaintenance = maintenance.endMaintenance;
    this.description = maintenance.description;
    this.userId = maintenance.userId;
  }

  get() {
    return {
      id: this.id,
      startMaintenance: this.startMaintenance,
      endMaintenance: this.endMaintenance,
      description: this.description,
      userId: this.userId,
    };
  }
  getId(): string {
    return this.id;
  }
  getStartMaintenance(): Date {
    return this.startMaintenance;
  }
  getEndMaintenance(): Date {
    return this.endMaintenance;
  }
  getDescription(): string {
    return this.description;
  }
  getUserId(): string {
    return this.userId;
  }
  setId(id: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (uuidRegex.test(id)) {
      this.id = id;
    } else {
      throw new Error('is not a valid UUID');
    }
  }
  setStartMaintenance(startMaintenance: Date): void {
    if (startMaintenance instanceof Date) {
      this.startMaintenance = startMaintenance;
    } else {
      throw new ConflictException('startMaintenance must be of type Date');
    }
  }
  setEndMaintenance(endMaintenance: Date | null): void {
    if (endMaintenance instanceof Date || endMaintenance === null) {
      this.endMaintenance = endMaintenance;
    } else {
      throw new ConflictException('endMaintenance must be of type Date');
    }
  }
  setDescription(description: string): void {
    this.description = description;
  }
  setUserId(userId: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (uuidRegex.test(userId)) {
      this.userId = userId;
    } else {
      throw new Error('is not a valid UUID');
    }
  }
  create(userId: string, description?: string): void {
    this.setId(randomUUID());
    this.setStartMaintenance(new Date());
    this.setEndMaintenance(null);
    this.setDescription(description);
    this.setUserId(userId);
  }
}
