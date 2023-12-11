import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { JwtService } from '@nestjs/jwt';
import { SessionResponseDto } from './dtos/response/response-session.dto';
import { SessionsRepository } from './repositories/sessions.repository';
import { Session } from './sessions.entity';

@Injectable()
export class SessionsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly repository: SessionsRepository,
  ) {}

  async save(session: Session): Promise<SessionResponseDto> {
    return this.repository.save(session);
  }

  async disconnectedMany(userId: string) {
    return this.repository.disconnectedMany(userId);
  }

  async generateToken(userId: string, sessionId: string): Promise<string> {
    const payload = {
      sign: {
        sub: userId,
        sessionId,
      },
    };
    return await this.jwtService.signAsync(payload);
  }
}
