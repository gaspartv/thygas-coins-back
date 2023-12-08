import { FindTokenDto } from '../dtos/internal/find.dto';
import { TokenResponseDto } from '../dtos/response/response-token.dto';
import { Tokens } from '../tokens.entity';

export abstract class TokensRepository {
  abstract save(PasswordTokens: Tokens): Promise<TokenResponseDto>;
  abstract find(where: FindTokenDto): Promise<TokenResponseDto>;
  abstract findMany(where: FindTokenDto): Promise<TokenResponseDto[]>;
}
