export interface JwtPayloadInterface {
  iat?: number;
  exp?: number;
  sign: SignInterface;
}
export interface ApplicationInterface {
  sign: SignInterface;
}
export interface SignInterface {
  sub: string;
  sessionId: string;
}
