import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CronService {
  constructor(private readonly prisma: PrismaService) {}
}
