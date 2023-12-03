import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';

interface DateClassInterface {
  createdAt?: Date;
  updatedAt?: Date;
  disabledAt?: Date | null;
  deletedAt?: Date | null;
}

export class DateClass {
  createdAt: Date;
  updatedAt: Date;
  disabledAt: Date | null;
  deletedAt: Date | null;

  constructor(dateClass: DateClassInterface) {
    this.createdAt = dateClass.createdAt;
    this.updatedAt = dateClass.updatedAt;
    this.disabledAt = dateClass.disabledAt;
    this.deletedAt = dateClass.deletedAt;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getDisabledAt(): Date {
    return this.disabledAt;
  }

  getDeletedAt(): Date {
    return this.deletedAt;
  }

  setCreatedAt(createdAt: Date): void {
    if (createdAt instanceof Date) {
      this.createdAt = createdAt;
    } else {
      throw new ConflictException('createdAt must be of type Date');
    }
  }

  setUpdatedAt(updatedAt: Date): void {
    if (updatedAt instanceof Date) {
      this.updatedAt = updatedAt;
    } else {
      throw new ConflictException('updatedAt must be of type Date');
    }
  }

  setDisabledAt(disabledAt: Date | null): void {
    if (disabledAt instanceof Date || disabledAt === null) {
      this.disabledAt = disabledAt;
    } else {
      throw new ConflictException('disabledAt must be of type Date');
    }
  }

  setDeletedAt(deletedAt: Date | null): void {
    if (deletedAt instanceof Date || deletedAt === null) {
      this.deletedAt = deletedAt;
    } else {
      throw new ConflictException('deletedAt must be of type Date');
    }
  }
}
