import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ApiModule } from './api/api.module';
import config from './config/configuration';
import { AsyncLocalStorageInterceptor } from './lib/infra/nest-auth-passport';
import { CorrelationIdInterceptor } from './lib/infra/telemetry';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const api = await NestFactory.create<NestFastifyApplication>(
    ApiModule,
    new FastifyAdapter({
      logger: true,
    }),
    { abortOnError: false },
  );
  
  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(api, swaggerConfig);
  SwaggerModule.setup('api', api, document);
  
  writeFileSync('swagger.json', JSON.stringify(document, null, 2));

  api.enableCors({
    origin: ['http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Cache-Control', 'Last-Event-ID', 'x-request-id'],
    exposedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  });
  const appConfig = config();
  api.useGlobalInterceptors(
    new CorrelationIdInterceptor(),
    new AsyncLocalStorageInterceptor(),
  );
  api.useGlobalPipes(new ValidationPipe());
  await api.listen(appConfig.http.port, appConfig.http.ip, () => {
    console.log(
      `HTTP server is listening on ${appConfig.http.ip}:${appConfig.http.port}`,
    );
    console.log(`Swagger documentation available at http://${appConfig.http.ip}:${appConfig.http.port}/api`);
  });

  await NestFactory.createMicroservice(AppModule);
}
bootstrap();
