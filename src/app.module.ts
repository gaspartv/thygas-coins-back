import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
