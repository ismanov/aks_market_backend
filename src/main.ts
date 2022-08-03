import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'common/filters/http-exception.filter';

// security
import fastifyHelmet from 'fastify-helmet';

// modules
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;

  const fastifyAdapter = new FastifyAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  //app.useGlobalPipes(new ValidationPipe());

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: false,
  });

  const config = new DocumentBuilder()
    .setTitle('Aks market apies')
    .setDescription('The aks API description')
    .setVersion('1.01')
    .addTag('aks')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(PORT);
  console.log(`started ${PORT}`);
}

bootstrap();
