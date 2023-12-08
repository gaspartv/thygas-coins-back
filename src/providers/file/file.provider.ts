import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { randomUUID } from 'crypto';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { IFileUpload } from '../../modules/users/dtos/request/update-image-user.dto';
import { mainDirname } from '../../root-dirname';

@Injectable()
export class FileProvider {
  save(file: IFileUpload, path: string): string {
    const extensionName = file.mimetype.split('/')[1];
    const dbUri: string = `${randomUUID().toString()}.${extensionName}`;
    const filePath = join(mainDirname, 'tmp', path, dbUri);
    file.mv(filePath);
    return dbUri;
  }

  remove(path: string): void {
    const filePath = join(mainDirname, 'tmp', path);
    unlinkSync(filePath);
  }
}
