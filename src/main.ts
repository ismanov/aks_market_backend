import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// security
import { fastifyHelmet } from 'fastify-helmet';

// modules
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;

  const fastifyAdapter = new FastifyAdapter();

  fastifyAdapter
    .getInstance()
    .addContentTypeParser(
      'application/json',
      { bodyLimit: 0 },
      (_request, _payload, done) => {
        done(null, {});
      },
    );

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.register(fastifyHelmet);

  const config = new DocumentBuilder()
    .setTitle('Aks market example')
    .setDescription('The aks API description')
    .setVersion('1.0')
    .addTag('aks')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}

bootstrap();
