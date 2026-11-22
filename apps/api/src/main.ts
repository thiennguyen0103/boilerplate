import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AuthorizationExceptionFilter } from './modules/authorization/presentation/http/filters/authorization-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  const apiPrefix = config.getOrThrow<string>('app.prefix');
  const port = config.getOrThrow<number>('app.port');
  const webOrigin = config.getOrThrow<string>('cors.webOrigin');
  const adminOrigin = config.getOrThrow<string>('cors.adminOrigin');
  const additionalOrigins = config.getOrThrow<string[]>('cors.allowedOrigins');

  app.set('trust proxy', config.getOrThrow('app.trustProxy'));
  app.use(helmet());
  app.use(cookieParser());

  // Global API prefix
  app.setGlobalPrefix(apiPrefix);

  // CORS
  app.enableCors({
    origin: [webOrigin, adminOrigin, ...additionalOrigins],
    credentials: true,
  });

  // Global request validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Authorization exception filter
  app.useGlobalFilters(new AuthorizationExceptionFilter());

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(config.getOrThrow<string>('app.name'))
    .setDescription(config.getOrThrow<string>('app.description'))
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  // Graceful shutdown
  app.enableShutdownHooks();

  await app.listen(port);
}
void bootstrap();
