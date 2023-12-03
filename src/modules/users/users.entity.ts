import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { Language, UserPolice } from '@prisma/client';
import { DateClass } from '../../common/classes/date.class';
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
  imageUri?: string;
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
  private imageUri: string;
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

  setPassword(password: string) {
    const regex =
      /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z])(?!.*(.)\1{2,})(?!.*\d{3,}).{8,50}$/;

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (regex.test(password) || uuidRegex.test(password)) {
      this.password = password;
    } else {
      throw new ConflictException(
        'the password must be between 8 and 50 characters long, contain at least one uppercase letter, one lowercase letter, one special character, and cannot have numeric or alphabetic sequences of three characters or more',
      );
    }
  }

  setImageUri(imageUri: string): void {
    const regex =
      /^\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\.(png|jpg|jpeg|gif|bmp|tiff|tif|svg|webp|ico)$/;

    if (regex.test(imageUri)) {
      this.imageUri = imageUri;
    } else {
      throw new ConflictException('URI is not valid');
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
    const whatsappVerify = Number(whatsapp);

    if (
      whatsapp.length < 10 ||
      whatsapp.length > 13 ||
      Number.isNaN(whatsappVerify)
    ) {
      throw new ConflictException(
        'invalid whatsapp. Exempla: 55xx9xxxxxxxx - Between 10 and 13 numbers entered',
      );
    }

    let whatsappFormat = whatsapp;

    if (whatsapp.toString()[0] !== '5' && whatsapp[1].toString() !== '5') {
      whatsappFormat = '55' + whatsapp.toString();
    }

    if (whatsappFormat.length === 12) {
      whatsappFormat =
        whatsappFormat.substring(0, 4) + '9' + whatsappFormat.substring(4);
    }

    this.whatsapp = whatsappFormat;
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
        case UserPoliceEnum.VIEWER:
          this.police = UserPolice.VIEWER;
          break;
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
}
