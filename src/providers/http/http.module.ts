import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { HttpService } from './http.provider';

@Module({
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
