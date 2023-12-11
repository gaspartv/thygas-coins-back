export class FindSessionDto {
  id?: string | null;
  connectedAt?: any | null;
  disconnectedAt?: Date | null;
  expiresAt?: Date | null;
  token?: string | null;
  userId?: string | null;
}
