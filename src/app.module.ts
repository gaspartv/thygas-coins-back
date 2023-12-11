import { SendGridModule } from '@anchan828/nest-sendgrid';
import { MiddlewareConsumer } from '@nestjs/common';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { NestModule } from '@nestjs/common/interfaces/modules/nest-module.interface';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtGuard } from './modules/sessions/guards/session.guard';
import { RefreshTokenMiddleware } from './modules/sessions/middlewares/refresh-token.middleware';
import { SessionsModule } from './modules/sessions/sessions.module';
import { JwtStrategy } from './modules/sessions/strategies/jwt-strategy';
import { TokensModule } from './modules/tokens/tokens.module';
import { UsersModule } from './modules/users/users.module';
import { FileModule } from './providers/file/file.module';
import { HttpModule } from './providers/http/http.module';
import { EmailModule } from './providers/mail/email.module';

@Module({
  imports: [
    SessionsModule,
    TokensModule,
    FileModule,
    HttpModule,
    EmailModule,
    UsersModule,
    ConfigModule.forRoot(),
    SendGridModule.forRoot({
      apikey: process.env.SENDGRID_API_KEY,
    }),
    PassportModule.register({ defaultStrategy: 'jwt-all' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [],
  providers: [
    JwtService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtGuard },
  ],
  exports: [JwtStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).forRoutes('*');
  }
}
