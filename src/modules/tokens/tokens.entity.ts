import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { TokenType } from '@prisma/client';
import { randomUUID } from 'crypto';
import { DateClass } from '../../common/classes/date.class';
import { TokenTypeEnum } from './enum/token-type.enum';

interface TokensInterface {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  expiresAt?: Date;
  revokedAt?: Date;
  usedAt?: Date;
  type?: TokenType;
  userId?: string;
}

export class Tokens extends DateClass {
  private id: string;
  private expiresAt: Date;
  private revokedAt: Date;
  private usedAt: Date;
  private type: TokenType;
  private userId: string;

  constructor(token: TokensInterface) {
    super({
      createdAt: token.createdAt,
      updatedAt: token.updatedAt,
    });
    this.id = token.id;
    this.expiresAt = token.expiresAt;
    this.revokedAt = token.revokedAt;
    this.usedAt = token.usedAt;
    this.type = token.type;
    this.userId = token.userId;
  }

  get() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      expiresAt: this.expiresAt,
      revokedAt: this.revokedAt,
      usedAt: this.usedAt,
      type: this.type,
      userId: this.userId,
    };
  }

  getId(): string {
    return this.id;
  }

  getExpiresAt(): Date {
    return this.expiresAt;
  }

  getRevokedAt(): Date {
    return this.revokedAt;
  }

  getUsedAt(): Date {
    return this.usedAt;
  }

  getType(): TokenType {
    return this.type;
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

  setExpiresAt(expiresAt: Date): void {
    if (expiresAt instanceof Date) {
      this.expiresAt = expiresAt;
    } else {
      throw new ConflictException('expiresAt must be of type Date');
    }
  }

  setRevokedAt(revokedAt: Date): void {
    if (revokedAt instanceof Date || revokedAt === null) {
      this.revokedAt = revokedAt;
    } else {
      throw new ConflictException('revokedAt must be of type Date');
    }
  }

  setUsedAt(usedAt: Date): void {
    if (usedAt instanceof Date || usedAt === null) {
      this.usedAt = usedAt;
    } else {
      throw new ConflictException('usedAt must be of type Date');
    }
  }

  setType(type: TokenTypeEnum): void {
    switch (type) {
      case TokenTypeEnum.EMAIL:
        this.type = TokenType.EMAIL;
        break;
      default:
        this.type = TokenType.PASSWORD;
        break;
    }
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

  create(userId: string): void {
    this.setId(randomUUID());
    this.setCreatedAt(new Date());
    this.setUpdatedAt(new Date());
    this.setExpiresAt(new Date(Date.now() + 1000 * 60 * 60 * 24));
    this.setRevokedAt(null);
    this.setUsedAt(null);
    this.setUserId(userId);
  }

  verifyExpiresAt() {
    if (this.expiresAt < new Date()) {
      throw new ConflictException('token expired');
    }
  }

  verifyUsedAt() {
    if (this.usedAt) {
      throw new ConflictException('token already used');
    }
  }

  verifyRevokedAt() {
    if (this.revokedAt) {
      throw new ConflictException('token revoked');
    }
  }
}
