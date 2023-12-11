import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { CanActivate } from '@nestjs/common/interfaces/features/can-activate.interface';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { Reflector } from '@nestjs/core/services/reflector.service';
import { JwtService } from '@nestjs/jwt';
import { UserPolice } from '@prisma/client';
import { UsersRepository } from '../../modules/users/repositories/users.repository';
import { IS_ADMIN } from '../decorators/is-admin.decorator';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirePasswordCheck: boolean =
      this.reflector.getAllAndOverride<boolean>(IS_ADMIN, [
        context.getHandler(),
        context.getClass(),
      ]);
    if (!requirePasswordCheck) return true;
    const request = context.switchToHttp().getRequest();
    await this.validate(request.headers.authorization, request.originalUrl);
    return true;
  }

  async validate(authorization: string, url: string): Promise<void> {
    const token = authorization.split('Bearer ')[1];
    if (!token) throw new UnauthorizedException('unauthorized');
    const decoded = this.jwtService.decode(token);
    const validateDecoded =
      !decoded || !decoded.sign || !decoded.sign.sessionId || !decoded.sign.sub;
    if (validateDecoded) throw new UnauthorizedException('unauthorized');
    const userId = decoded.sign.sub;
    const user = await this.usersRepository.find({
      id: userId,
      deletedAt: null,
      disabledAt: url.includes('users/enabled') ? undefined : null,
      police: UserPolice.ADMIN,
    });
    if (!user) throw new UnauthorizedException('unauthorized');
    return;
  }
}
