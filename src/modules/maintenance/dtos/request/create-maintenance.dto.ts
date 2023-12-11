import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMaintenanceDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
