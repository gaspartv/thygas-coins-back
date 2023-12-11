import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { compareSync } from 'bcrypt';
import { randomUUID } from 'crypto';

interface SessionInterface {
  id?: string;
  connectedAt?: Date;
  disconnectedAt?: Date | null;
  expiresAt?: Date;
  token?: string;
  userId?: string;
}

export class Session {
  private id: string;
  private connectedAt: Date;
  private disconnectedAt: Date | null;
  private expiresAt: Date;
  private token: string;
  private userId: string;

  constructor(session: SessionInterface) {
    this.id = session.id;
    this.connectedAt = session.connectedAt;
    this.disconnectedAt = session.disconnectedAt;
    this.expiresAt = session.expiresAt;
    this.token = session.token;
    this.userId = session.userId;
  }
  get() {
    return {
      id: this.getId(),
      connectedAt: this.getConnectedAt(),
      disconnectedAt: this.getDisconnectedAt(),
      expiresAt: this.getExpiresAt(),
      token: this.getToken(),
      userId: this.getUserId(),
    };
  }
  getId(): string {
    return this.id;
  }
  getConnectedAt(): Date {
    return this.connectedAt;
  }
  getDisconnectedAt(): Date {
    return this.disconnectedAt;
  }
  getExpiresAt(): Date {
    return this.expiresAt;
  }
  getToken(): string {
    return this.token;
  }
  getUserId(): string {
    return this.userId;
  }

  setId(id: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (uuidRegex.test(id)) {
      this.id = id;
    } else {
      throw new Error('is not a valid UUID');
    }
  }
  setConnectedAt(connectedAt: Date): void {
    if (connectedAt instanceof Date) {
      this.connectedAt = connectedAt;
    } else {
      throw new ConflictException('connectedAt must be of type Date');
    }
  }
  setDisconnectedAt(disconnectedAt: Date | null): void {
    if (disconnectedAt instanceof Date || disconnectedAt === null) {
      this.disconnectedAt = disconnectedAt;
    } else {
      throw new ConflictException('disconnectedAt must be of type Date');
    }
  }
  setExpiresAt(): void {
    const dateNow = new Date();
    const expiresIn = Number(process.env.JWT_EXPIRES_IN);
    dateNow.setTime(dateNow.getTime() + expiresIn);
    if (dateNow instanceof Date) {
      this.expiresAt = dateNow;
    } else {
      throw new ConflictException('expiresAt must be of type Date');
    }
  }
  setToken(token: string): void {
    this.token = token;
  }
  setUserId(userId: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (uuidRegex.test(userId)) {
      this.userId = userId;
    } else {
      throw new Error('is not a valid UUID');
    }
  }

  create(userId: string) {
    this.setId(randomUUID());
    this.setConnectedAt(new Date());
    this.setDisconnectedAt(null);
    this.setExpiresAt();
    this.setUserId(userId);
  }

  comparePassword(password: string, passwordDb: string) {
    const passwordIsCorrect = compareSync(password, passwordDb);
    if (!passwordIsCorrect) {
      throw new UnauthorizedException('invalid email or password');
    }
  }
}
