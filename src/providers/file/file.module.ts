import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { FileProvider } from './file.provider';

@Module({
  providers: [FileProvider],
  exports: [FileProvider],
})
export class FileModule {}
