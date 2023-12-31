import { Logger, NestInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyFileUpload from 'fastify-file-upload';
import { join } from 'path';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './providers/prisma/prisma.exception.filter';
import { TransformationInterceptor } from './common/interceptors/http-global.interceptor';
import { mainDirname } from './root-dirname';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true,
      transform: true,
      transformOptions: { groups: ['transform'] },
    }),
  );

  app.register(fastifyFileUpload, {
    limits: { fileSize: 1024 * 1024 * 5 },
    useTempFiles: true,
    tempFileDir: 'tmp',
    createParentPath: true,
    uriDecodeFileNames: true,
    safeFileNames: '/.(jpg|jpeg|png)$/i',
    preserveExtension: true,
  });

  app.useStaticAssets({ root: join(mainDirname, 'tmp') });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API Thygas Coins')
    .setDescription('Api desenvolvida para a loja online thygascoins.store')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const httpAdapter = app.getHttpAdapter();
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalInterceptors(new TransformationInterceptor<NestInterceptor>());

  await app.listen(Number(process.env.PORT), '0.0.0.0', () => {
    Logger.log(`>>> Server is running on port ${process.env.PORT}`);
  });
}
bootstrap();
