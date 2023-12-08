export class TokenResponseDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  usedAt: Date | null;
  userId: string;
}
