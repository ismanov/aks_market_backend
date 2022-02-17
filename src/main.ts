import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

// swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// security
import helmet from 'fastify-helmet';

// modules
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;


  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.register(helmet, {
    contentSecurityPolicy: false,
  });

  const config = new DocumentBuilder()
    .setTitle('Aks market example')
    .setDescription('The aks API description')
    .setVersion('1.0')
    .addTag('aks')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(PORT);
  console.log(`started ${PORT}`);
}

bootstrap();
