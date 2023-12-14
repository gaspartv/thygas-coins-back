import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Logger } from '@nestjs/common/services/logger.service';
import { randomUUID } from 'crypto';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { IFileUpload } from '../../modules/users/dtos/request/update-image-user.dto';
import { mainDirname } from '../../root-dirname';

@Injectable()
export class FileProvider {
  save(file: IFileUpload, path: string): string | null {
    try {
      const extensionName = file.mimetype.split('/')[1];
      const dbUri: string = `${randomUUID().toString()}.${extensionName}`;
      const filePath = join(mainDirname, 'tmp', path, dbUri);
      file.mv(filePath);
      return dbUri;
    } catch (err) {
      Logger.error(err.message);
      return null;
    }
  }

  remove(path: string): void {
    try {
      const filePath = join(mainDirname, 'tmp', path);
      unlinkSync(filePath);
    } catch (err) {
      Logger.error(err.message);
      return;
    }
  }
}
