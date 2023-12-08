import { FileModule } from './providers/file/file.module';
import { HttpModule } from './providers/http/http.module';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { EmailModule } from './providers/mail/email.module';

@Module({
  imports: [
    FileModule,
    HttpModule,
    EmailModule,
    UsersModule,
    ConfigModule.forRoot(),
    SendGridModule.forRoot({
      apikey: process.env.SENDGRID_API_KEY,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
