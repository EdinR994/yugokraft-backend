import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {PinoLogger} from "./logger/logger";
const v8 = require('v8');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const pinoLogger = PinoLogger.construct();
  app
      .use(pinoLogger.getExpressMiddleware())
      .setGlobalPrefix('api')
      .useLogger(pinoLogger);
  const options = new DocumentBuilder()
      .addBearerAuth({ type: "http", scheme: 'bearer', bearerFormat: 'JWT' })
      .setTitle('Yugokraft API')
      .setDescription('api')
      .setVersion('1.0.0')
      .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(Number(process.env.PORT) || 4000);
}

bootstrap()
