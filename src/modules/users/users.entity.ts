import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { Language, UserPolice } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { DateClass } from '../../common/classes/date.class';
import { Format } from '../../utils/format-whatsapp';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { UpdateUserDto } from './dtos/request/update-user.dto';
import { UserLanguageEnum } from './enum/user-language.enum';
import { UserPoliceEnum } from './enum/user-police.enum';

interface UserInterface {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  disabledAt?: Date;
  deletedAt?: Date;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  imageUri?: string | null;
  identityDocument?: string;
  whatsapp?: string;
  darkMode?: boolean;
  language?: Language;
  police?: UserPolice;
}

export class User extends DateClass {
  private id: string;
  private firstName: string;
  private lastName: string;
  private email: string;
  private password: string;
  private imageUri: string | null;
  private identityDocument: string;
  private whatsapp: string;
  private darkMode: boolean;
  private language: Language;
  private police: UserPolice;

  constructor(user: UserInterface) {
    super({
      createdAt: user.createdAt,
      disabledAt: user.disabledAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    });
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.password = user.password;
    this.imageUri = user.imageUri;
    this.identityDocument = user.identityDocument;
    this.whatsapp = user.whatsapp;
    this.darkMode = user.darkMode;
    this.language = user.language;
    this.police = user.police;
  }

  get() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      disabledAt: this.disabledAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      imageUri: this.imageUri,
      identityDocument: this.identityDocument,
      whatsapp: this.whatsapp,
      darkMode: this.darkMode,
      language: this.language,
      police: this.police,
    };
  }

  getId(): string {
    return this.id;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  getImageUri(): string {
    return this.imageUri;
  }

  getIdentityDocument(): string {
    return this.identityDocument;
  }

  getWhatsapp(): string {
    return this.whatsapp;
  }

  getDarkMode(): boolean {
    return this.darkMode;
  }

  getLanguage(): Language {
    return this.language;
  }

  getPolice(): UserPolice {
    return this.police;
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

  setFirstName(firstName: string): void {
    const regex = /^[a-zA-Z]+$/;

    if (
      firstName.length >= 2 &&
      firstName.length <= 30 &&
      regex.test(firstName)
    ) {
      this.firstName =
        firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    } else {
      throw new ConflictException(
        'the first name must only have letters between 2 and 30 characters',
      );
    }
  }

  setLastName(lastName: string): void {
    const regex = /^[a-zA-Z]+$/;

    if (lastName.length >= 2 && lastName.length <= 30 && regex.test(lastName)) {
      this.lastName =
        lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
    } else {
      throw new ConflictException(
        'the last name must only have letters between 2 and 30 characters',
      );
    }
  }

  setEmail(email: string): void {
    const regex = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;

    if (regex.test(email)) {
      this.email = email.toLowerCase();
    } else {
      throw new ConflictException('email is not valid');
    }
  }

  async setPassword(password: string): Promise<void> {
    const regex =
      /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z])(?!.*(.)\1{2,})(?!.*\d{3,}).{8,50}$/;

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (regex.test(password) || uuidRegex.test(password)) {
      this.password = await bcrypt.hash(
        password,
        Number(process.env.HASH_SALT),
      );
    } else {
      throw new ConflictException(
        'the password must be between 8 and 50 characters long, contain at least one uppercase letter, one lowercase letter, one special character, and cannot have numeric or alphabetic sequences of three characters or more',
      );
    }
  }

  setImageUri(imageUri?: string): void {
    if (imageUri) {
      const regex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|svg|webp|ico)$/;
      if (regex.test(imageUri)) {
        this.imageUri = '/user/avatar/' + imageUri;
      } else {
        throw new ConflictException('URI is not valid');
      }
    } else {
      this.imageUri = null;
    }
  }

  setIdentityDocument(identityDocument: string): void {
    const identityDocumentVerify = Number(identityDocument);

    if (
      identityDocument.length !== 11 ||
      Number.isNaN(identityDocumentVerify)
    ) {
      throw new ConflictException('invalid identity document');
    }

    this.identityDocument = identityDocument;
  }

  setWhatsapp(whatsapp: string): void {
    this.whatsapp = Format.whatsapp(whatsapp);
  }

  setDarkMode(darkMode: boolean): void {
    if (typeof darkMode === 'boolean') {
      this.darkMode = darkMode;
    } else {
      throw new ConflictException('darkMode must be of type Boolean');
    }
  }

  setLanguage(language: UserLanguageEnum): void {
    if (Object.values(UserLanguageEnum).includes(language)) {
      switch (language) {
        case UserLanguageEnum.EN_US:
          this.language = Language.EN_US;
          break;
        default:
          this.language = Language.PT_BR;
      }
    } else {
      throw new ConflictException('language needs to be en_us or pt_br');
    }
  }

  setPolice(police: UserPoliceEnum): void {
    if (Object.values(UserPoliceEnum).includes(police)) {
      switch (police) {
        case UserPoliceEnum.ADMIN:
          this.police = UserPolice.ADMIN;
          break;
        case UserPoliceEnum.SUPER:
          this.police = UserPolice.SUPER;
          break;
        default:
          this.police = UserPolice.NORMAL;
      }
    } else {
      throw new ConflictException(
        'police needs to be normal, viewer, admin or super',
      );
    }
  }

  async create(dto: CreateUserDto): Promise<void> {
    const password = randomUUID();
    this.setWhatsapp(dto.whatsapp);
    this.setId(randomUUID());
    this.setCreatedAt(new Date());
    this.setUpdatedAt(new Date());
    this.setDisabledAt(null);
    this.setDeletedAt(null);
    this.setFirstName(dto.firstName);
    this.setLastName(dto.lastName);
    this.setEmail(dto.email);
    await this.setPassword(password);
    this.setIdentityDocument(dto.identityDocument);
    this.setDarkMode(dto.darkMode);
    this.setLanguage(dto.language);
    this.setPolice(dto.police);
  }

  update(dto: UpdateUserDto): void {
    this.setUpdatedAt(new Date());
    if (dto.firstName) this.setFirstName(dto.firstName);
    if (dto.lastName) this.setLastName(dto.lastName);
    if (dto.identityDocument) this.setIdentityDocument(dto.identityDocument);
    if (dto.whatsapp) this.setWhatsapp(dto.whatsapp);
    if (dto.darkMode) this.setDarkMode(dto.darkMode);
    if (dto.language) this.setLanguage(dto.language);
  }

  verifyPassword(new_password: string, confirm_new_password: string): void {
    if (new_password !== confirm_new_password) {
      throw new ConflictException('new passwords do not match');
    }
  }

  verifyPasswordEqual(new_password: string, password: string): void {
    if (bcrypt.compareSync(new_password, password)) {
      throw new ConflictException('password is match');
    }
  }

  verifyPasswordNotEqual(new_password: string, password: string): void {
    if (!bcrypt.compareSync(new_password, password)) {
      throw new ConflictException('password do not match');
    }
  }
}
