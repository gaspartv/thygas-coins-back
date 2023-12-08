import { IsObject, IsOptional } from 'class-validator';

export enum Mimetype {
  MP3 = 'audio/mp3',
  MPEG = 'audio/mpeg',
  WAV = 'audio/wav',
  OGG = 'audio/ogg',

  MP4 = 'video/mp4',

  PNG = 'image/png',
  JPG = 'image/jpg',
  JPEG = 'image/jpeg',

  PDF = 'application/pdf',
}

export interface IFileUpload {
  name: string;
  data: {
    type: string;
    data: any[];
  };
  size: number;
  encoding: string;
  tempFilePath: string;
  truncated: false;
  mimetype: Mimetype;
  md5: string;
  mv(...args: unknown[]): unknown;
}

export class UploadFileUserDto {
  @IsOptional()
  @IsObject()
  file?: IFileUpload;
}
