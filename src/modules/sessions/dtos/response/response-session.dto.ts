export class SessionResponseDto {
  id: string;
  connectedAt: Date;
  disconnectedAt?: Date | null;
  expiresAt: Date;
  token: string;
  userId: string;
}
