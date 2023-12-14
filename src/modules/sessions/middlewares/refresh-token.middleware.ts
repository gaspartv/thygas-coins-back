import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { NestMiddleware } from '@nestjs/common/interfaces/middleware/nest-middleware.interface';
import { JwtService } from '@nestjs/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';
import { MaintenanceService } from '../../maintenance/maintenance.service';
import { UsersRepository } from '../../users/repositories/users.repository';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';
import { SessionsRepository } from '../repositories/sessions.repository';
import { Session } from '../sessions.entity';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly sessionsRepository: SessionsRepository,
    private readonly maintenanceService: MaintenanceService,
  ) {}
  refreshToken(req: any, res: any, next: (error?: any) => void) {
    return this.use(req, res, next);
  }

  async use(
    req: FastifyRequest,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    res: FastifyReply,
    next: (error?: any) => void,
  ): Promise<void> {
    const url = req.originalUrl;
    const maintenance = await this.maintenanceService.find({
      endMaintenance: null,
    });
    if (maintenance && !url.includes('/maintenance/end')) {
      throw new ConflictException(maintenance.description);
    }
    if (req.headers.authorization) {
      const token = req.headers.authorization.split('Bearer ')[1];
      if (!token) throw new UnauthorizedException('invalid token');
      const decoded = this.jwtService.decode(token);
      const validateDecoded =
        !decoded ||
        !decoded.sign ||
        !decoded.sign.sessionId ||
        !decoded.sign.sub;
      if (validateDecoded) throw new UnauthorizedException('invalid token');
      const userId = decoded.sign.sub;
      const user = await this.usersRepository.find({
        id: userId,
        deletedAt: null,
        disabledAt: url.includes('users/enabled') ? undefined : null,
      });
      if (!user) throw new UnauthorizedException('invalid token');
      const sessionFound = await this.sessionsRepository.find({
        userId,
        disconnectedAt: null,
      });
      const sessionValidate = !sessionFound || sessionFound.token !== token;
      if (sessionValidate) throw new UnauthorizedException('invalid token');
      const validateDate =
        Number(new Date().getTime()) >=
        Number(new Date(sessionFound.expiresAt).getTime());
      if (validateDate) {
        const payload: JwtPayloadInterface = {
          sign: {
            sub: sessionFound.userId,
            sessionId: sessionFound.id,
          },
        };
        const newToken = this.jwtService.sign(payload, {
          secret: process.env.JWT_SECRET,
        });
        req.headers.authorization = `Bearer ${newToken}`;
        const session = new Session(sessionFound);
        session.setExpiresAt();
        session.setToken(newToken);
        await this.sessionsRepository.save(session);
      }
    }
    next();
  }
}
