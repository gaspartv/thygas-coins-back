import { SendGridModule } from '@anchan828/nest-sendgrid';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { ConfigModule } from '@nestjs/config';
import { TokensModule } from './modules/tokens/tokens.module';
import { UsersModule } from './modules/users/users.module';
import { FileModule } from './providers/file/file.module';
import { HttpModule } from './providers/http/http.module';
import { EmailModule } from './providers/mail/email.module';

@Module({
  imports: [
    TokensModule,
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
