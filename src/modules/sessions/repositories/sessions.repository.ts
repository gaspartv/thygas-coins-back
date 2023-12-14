import { FindSessionDto } from '../dtos/internal/find-session.dto';
import { SessionResponseDto } from '../dtos/response/response-session.dto';
import { Session } from '../sessions.entity';

export abstract class SessionsRepository {
  abstract save(session: Session): Promise<SessionResponseDto>;
  abstract disconnectedMany(userId: string): Promise<{ count: number }>;
  abstract find(where: FindSessionDto): Promise<SessionResponseDto>;
  abstract disconnectedManyNot(userId: string): Promise<{ count: number }>;
}
