import { Language, UserPolice } from '@prisma/client';

export class UserResponseDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  disabledAt: Date | null;
  deletedAt: Date | null;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  imageUri: string | null;
  identityDocument: string;
  whatsapp: string;
  darkMode: boolean;
  language: Language;
  police: UserPolice;
}
