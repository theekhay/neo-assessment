import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  Logger,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './helpers/rcp-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpRef = app.getHttpAdapter().getHttpServer();
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Neo-Assesment Documentation')
    .setDescription('Task Management API Documentation')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      validationError: {
        target: false,
      },
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(errors);
      },
    }),
  );

  app.useLogger(app.get(Logger));
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter(httpRef, new Logger()));

  await app.listen(configService.get('PORT'), () =>
    console.log(`Vendaw Core is running on: ${configService.get('PORT')}`),
  );
}
bootstrap();
