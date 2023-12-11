import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RequestSignInDto } from './dtos/request/sign-in.dto';
import { SessionResponseDto } from './dtos/response/response-session.dto';
import { SessionsRepository } from './repositories/sessions.repository';
import { Session } from './sessions.entity';

@Injectable()
export class SessionsUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly repository: SessionsRepository,
  ) {}

  async save(session: Session): Promise<SessionResponseDto> {
    return this.repository.save(session);
  }

  async signIn(dto: RequestSignInDto) {
    const user = await this.userService.findEmail(dto.email);
    if (!user) throw new NotFoundException('invalid email or password');

    const passwordIsCorrect = compareSync(dto.password, user.password);
    if (!passwordIsCorrect) {
      throw new UnauthorizedException('invalid email or password');
    }
    const session = new Session({});
    session.create(user.id);
    await this.repository.disconnectedMany(user.id);
    const payload = {
      sign: {
        sub: user.id,
        sessionId: session.getId(),
      },
    };
    const accessToken = await this.jwtService.signAsync(payload);
    session.setToken(accessToken);
    this.save(session);
    return {
      accessToken,
      sessionId: session.getId(),
    };
  }
}
