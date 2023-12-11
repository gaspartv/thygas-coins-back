import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { MessageDto } from '../../common/dtos/message.dto';
import { UsersService } from '../users/users.service';
import { RequestSignInDto } from './dtos/request/sign-in.dto';
import { Session } from './sessions.entity';
import { SessionsService } from './sessions.service';

@Injectable()
export class SessionsUseCase {
  constructor(
    private readonly userService: UsersService,
    private readonly service: SessionsService,
  ) {}

  async signIn(dto: RequestSignInDto) {
    const user = await this.userService.findEmail(dto.email);
    if (!user) throw new NotFoundException('invalid email or password');
    const session = new Session({});
    session.comparePassword(dto.password, user.password);
    session.create(user.id);
    await this.service.disconnectedMany(user.id);
    const accessToken = await this.service.generateToken(
      user.id,
      session.getId(),
    );
    session.setToken(accessToken);
    this.service.save(session);
    return {
      accessToken,
    };
  }

  async logout(userId: string): Promise<MessageDto> {
    await this.service.disconnectedMany(userId);
    return { message: 'logout successfully' };
  }
}
